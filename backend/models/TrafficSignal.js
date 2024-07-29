import mongoose from "mongoose";

const TrafficSignalSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  tags: {
    highway: { type: String, required: true },
    junction: { type: String },
    name: { type: String },
  }
}, { collection: 'traffic_signals' });

const TrafficSignal = mongoose.model('TrafficSignal', TrafficSignalSchema);

export default TrafficSignal;