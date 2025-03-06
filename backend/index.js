import express from 'express';
import cors from 'cors';
import { connection } from './lib/data.js';
import { TrafficSignal } from './models/TrafficSignal.js';
import ambulanceRoutes from './routes/ambulance.js';
import trafficPoliceRoutes from './routes/trafficpolice.js';
import redisRoutes from './routes/redis.route.js'
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { findNearbyTrafficSignals } from './utils/trafficSignalMatcher.js';
import { createClusters, clusters } from './utils/trafficSignalClusters.js';
import { redisClient, setCache } from './lib/redis.js';
import TrafficPoliceData from './models/TrafficPoliceData.js'
import jwt from "jsonwebtoken";

dotenv.config();

const REQUEST_TRAFFIC_SIGNALS_EVENT = 'request-traffic-signals';
const TRAFFIC_SIGNALS_MATCHES_EVENT = 'traffic-signals-matches';
const UPDATED_LOCATION_EVENT = 'update-location';
export let unfilteredClusters = [];
let cachedClusters = [];

redisClient.connect(() => console.log("🔹 Redis connected!"));

redisClient.ping()
  .then((res) => console.log("✅ Redis Ping Response:", res))
  .catch((err) => console.error("❌ Redis Connection Error:", err));


setCache('testKey', 'Hello, Redis!');

export const initializeClusters = async () => {
  try {
    console.log("Processing clusters...");
    cachedClusters = await createClusters();
    console.log("Clusters processed and cached.");
    unfilteredClusters = clusters; // Assign the clusters globally
  } catch (err) {
    console.error("Error initializing clusters:", err);
  }
};

// Initialize clusters on startup
initializeClusters();

// Function to create trafficPolice data using matchedData and ambulanceId
const createTrafficPoliceData = async (matchedData, ambulanceId) => {
  try {
    // Fetch all traffic police officers
    const trafficPoliceOfficers = await TrafficPoliceData.find({});

    let trafficPoliceRedisData = [];

    trafficPoliceOfficers.forEach((officer) => {
      // Check if any signal in matchedData exists in officer's clusterZone
      const isMatch = officer.clusterZone.some((zone) =>
        matchedData.some((signal) => signal.lat === zone.lat && signal.lng === zone.lon)
      );

      if (isMatch) {
        trafficPoliceRedisData.push({
          trafficPoliceId: officer._id.toString(),
          ambulanceId: ambulanceId,
        });
      }
    });

    console.log("Traffic Police Redis Data:", trafficPoliceRedisData);

    return trafficPoliceRedisData; // Return the matched data if needed
  } catch (error) {
    console.error("Error creating traffic police data:", error);
    return [];
  }
};


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], credentials: true }));

// API Routes
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/trafficpolice', trafficPoliceRoutes);
app.use('/redis/api', redisRoutes);


// Sample routes
app.get('/', (req, res) => res.send('Express + WebSocket API Server is running!'));
app.get('/user', (req, res) => res.send('Life matters'));

app.get('/api/traffic-signal', async (req, res) => {
  try {
    const trafficSignal = await TrafficSignal.findOne();
    if (trafficSignal?.elements) {
      const results = trafficSignal.elements.map(element => ({
        id: element.id,
        lat: element.lat,
        lon: element.lon,
      }));
      return res.json(results);
    } else {
      return res.status(404).json({ message: 'No traffic signal data found' });
    }
  } catch (error) {
    console.error('Error fetching traffic signals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/traffic-clusters', (req, res) => {
  if (cachedClusters.length === 0) {
    return res.status(503).json({ message: "Clusters are still being processed. Try again later." });
  }
  res.json(cachedClusters);
});


io.on('connection', (socket) => {
  console.log('Client socket ID:', socket.id);

  // Handle traffic signal requests
  socket.on(REQUEST_TRAFFIC_SIGNALS_EVENT, async (routePoints, token) => {
    console.log('Received request for traffic signals.');
    try {
      const signals = await findNearbyTrafficSignals(routePoints);
      const matchedData = signals.map(signal => ({
        lat: signal.trafficSignal.geometry.coordinates[1],
        lng: signal.trafficSignal.geometry.coordinates[0],
      }));
      console.log('Traffic signals found:', matchedData);
      socket.broadcast.emit(TRAFFIC_SIGNALS_MATCHES_EVENT, matchedData);
      //redis data update
      const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
      let key = `ambulance:${decoded.ambulance.id}`;
      await redisClient.hset(key, {
        traffic_signals: JSON.stringify(matchedData),
        ambulance_number: decoded.ambulance.vehicleNumber,
        driver_name: decoded.ambulance.name,
        driver_number: decoded.ambulance.phone,
      });
      await redisClient.expire(key, 3600);
      // create traffic police data
      const trafficPoliceData = await createTrafficPoliceData(matchedData, decoded.ambulance.id);
      if (trafficPoliceData.length > 0) {
        console.log(trafficPoliceData.length);
        for (const entry of trafficPoliceData) {
          let policeKey = `trafficPolice:${entry.trafficPoliceId}`;
      
          // Get existing ambulance IDs from Redis
          let existingAmbulanceIds = await redisClient.hget(policeKey, "ambulance_ids");
          
          // Parse existing IDs or initialize an empty array
          let ambulanceIds = existingAmbulanceIds ? JSON.parse(existingAmbulanceIds) : [];
      
          // Append new ambulance ID if not already present
          if (!ambulanceIds.includes(entry.ambulanceId)) {
            ambulanceIds.push(entry.ambulanceId);
          }
      
          // Store updated list back in Redis
          await redisClient.hset(policeKey, {
            ambulance_ids: JSON.stringify(ambulanceIds), // Store as a JSON string
          });
          socket.broadcast.emit('police-id-update', entry.trafficPoliceId);
          await redisClient.expire(policeKey, 3600); // Set expiry if needed
          console.log(`✅ Updated Redis: ${policeKey} ->`, ambulanceIds);
        }
      } else {
        console.log("⚠️ No matching traffic police data found.");
      }      
    } catch (error) {
      console.error('Error finding traffic signals:', error);
      socket.emit(TRAFFIC_SIGNALS_MATCHES_EVENT, { message: 'Error fetching traffic signals' });
    }
  });

  socket.on(UPDATED_LOCATION_EVENT, (data) => {
    console.log("Location received:", data);
    socket.broadcast.emit(UPDATED_LOCATION_EVENT, data);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket connection closed for socket ID:', socket.id);
  });
});

// Database Connection and Server Start
const PORT = process.env.PORT || 8083;

connection
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });