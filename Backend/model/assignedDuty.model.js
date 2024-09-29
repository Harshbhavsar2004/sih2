import mongoose from "mongoose";

const { Schema } = mongoose;

const TripSchema = new Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  tripDuration: { type: String, required: true },
  distanceFromPreviousTrip: { type: String, required: true },
  stops: [{ type: String, required: true }],
  stopTimes: [{ type: String, required: true }],
});

const AssignedDutySchema = new Schema({
  driver: { type: String, required: true },
  route: [{ type: String, required: true }],
  tripIDs: [{ type: String, required: true }],
  trips: [TripSchema],
  totalScheduledTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AssignedDuty = mongoose.model("AssignedDuty", AssignedDutySchema);

export default AssignedDuty;