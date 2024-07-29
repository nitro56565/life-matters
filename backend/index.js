import express from 'express';
import cors from 'cors';
import { connection } from './data.js';
import TrafficSignal from './models/TrafficSignal.js'; // Import the model
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["https://life-matters.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true,
}));

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/user", (req, res) => {
  res.send("life matters");
});

app.get("/api/traffic-signal", async (req, res) => {
  try {
    const trafficSignals = await TrafficSignal.find().lean();
    const transformedSignals = trafficSignals.map(signal => {
      return {
        ...signal,
        id: signal.id.valueOf(),
        lat: signal.lat.valueOf(),
        lon: signal.lon.valueOf(),
        tags: {
          ...signal.tags,
        },
      };
    });
    res.json(transformedSignals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(process.env.PORT || 8083, () => {
  connection
    .then(() => {
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
      db.once('open', () => {
        console.log('Connected to MongoDB');
      });
      console.log(`Server is listening on port http://localhost:${process.env.PORT || 8083}`);
    })
    .catch((error) => {
      console.error("Failed to connect to the database:", error);
      process.exit(1);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});