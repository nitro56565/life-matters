import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  type: String,
  id: Number,
  lat: Number,
  lon: Number,
  tags: Object,
});

const trafficSignalSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  version: String,
  generator: String,
  osm3s: Object,
  elements: [elementSchema],
});

export const TrafficSignal = mongoose.model('TrafficSignal', trafficSignalSchema, 'pune-traffic-signals');