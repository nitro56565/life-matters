import express from 'express';
import cors from 'cors';
import { connection } from './data.js';
import { TrafficSignal } from './models/TrafficSignal.js';
import ambulanceRoutes from './routes/ambulance.js';
import trafficPoliceRoutes from './routes/trafficpolice.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { findNearbyTrafficSignals } from './utils/trafficSignalMatcher.js';
import { createClusters, clusters } from './utils/trafficSignalClusters.js';
dotenv.config();

const REQUEST_TRAFFIC_SIGNALS_EVENT = 'request-traffic-signals';
const TRAFFIC_SIGNALS_MATCHES_EVENT = 'traffic-signals-matches';
const UPDATED_LOCATION_EVENT = 'update-location';
export let unfilteredClusters = [];
let cachedClusters = [];


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
  socket.on(REQUEST_TRAFFIC_SIGNALS_EVENT, async (routePoints) => {
    console.log('Received request for traffic signals.');
    try {
      const signals = await findNearbyTrafficSignals(routePoints);
      const matchedData = signals.map(signal => ({
        lat: signal.trafficSignal.geometry.coordinates[1],
        lng: signal.trafficSignal.geometry.coordinates[0],
      }));
      console.log('Traffic signals found:', matchedData);
      socket.broadcast.emit(TRAFFIC_SIGNALS_MATCHES_EVENT, matchedData);
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