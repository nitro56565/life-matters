import mongoose from 'mongoose';

const TrafficPoliceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // location: {
  //   type: String,
  //   required: true,
  // },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  clusterZone: {
    type: Array,
    required: true,
  },
});

const TrafficPoliceData = mongoose.model('TrafficPolice', TrafficPoliceSchema);

export default TrafficPoliceData;