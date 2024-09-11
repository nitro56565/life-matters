import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AmbulanceDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash the password before saving
AmbulanceDataSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('AmbulanceData', AmbulanceDataSchema);