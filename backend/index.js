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

dotenv.config();

const REQUEST_TRAFFIC_SIGNALS_EVENT = 'request-traffic-signals';
const TRAFFIC_SIGNALS_MATCHES_EVENT = 'traffic-signals-matches';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Adjust to your frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Adjust to your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// RESTful API Routes
app.options('*', cors());
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/trafficpolice', trafficPoliceRoutes);

// Sample routes
app.get('/', (req, res) => res.send('Express + WebSocket API Server is running!'));

app.get('/user', (req, res) => {
  res.send('Life matters');
});

app.get('/api/traffic-signal', async (req, res) => {
  try {
    const trafficSignal = await TrafficSignal.findOne();
    if (trafficSignal && trafficSignal.elements) {
      const results = trafficSignal.elements.map((element) => ({
        id: element.id,
        lat: element.lat,
        lon: element.lon,
      }));
      res.json(results);
    } else {
      res.status(404).json({ message: 'No traffic signal data found' });
    }
  } catch (error) {
    console.error('Error fetching traffic signals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

io.on('connection', (socket) => {
  console.log('A new WebSocket connection established.'); // Log when a connection is made

  // Log the socket ID to track the client
  console.log('Client socket ID:', socket.id);

  // Handle incoming WebSocket requests
  socket.on(REQUEST_TRAFFIC_SIGNALS_EVENT, async (routePoints) => {
    console.log('Received request for traffic signals.'); // Log when a request is received

    try {
      const signals = await findNearbyTrafficSignals(routePoints);

      console.log('Traffic signals found:', signals); // Log the found traffic signals
      socket.emit(TRAFFIC_SIGNALS_MATCHES_EVENT, signals);
    } catch (error) {
      console.error('Error finding traffic signals:', error); // Log errors if any
      socket.emit(TRAFFIC_SIGNALS_MATCHES_EVENT, { message: 'Error fetching traffic signals' });
    }
  });

  // Log when the client disconnects
  socket.on('disconnect', () => {
    console.log('WebSocket connection closed for socket ID:', socket.id); // Log disconnection with socket ID
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