import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  DriverName: { type: String, required: true },
  Location: { type: String, required: true },
  Email: { type: String, required: true },
  PhoneNumber: { type: String, required: true, unique: true },
  LicenseNumber: { type: String, required: true },
  otp: { type: String },
  tokens: [{ type: String }], // Changed to an array to store multiple tokens
  status: { type: String, default: 'linked' }, // Added status field with default value 'linked'
  homeLat: { type: Number }, // Added homeLat field
  homeLon: { type: Number },  // Added homeLon field
  assignedAt: { type: Date, default: Date.now }, // Add timestamp for when the duty was assigned
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;