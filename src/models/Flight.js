// models/Flight.js
import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  from: String,
  to: String,
  date: Date,
  departureTime: String,
  arrivalTime: String,
  basePrice: Number,
  currentPrice: Number,
  bookingAttempts: [Date],
  lastPriceUpdate: Date,
  logoUrl: String,
});

export default mongoose.models.Flight || mongoose.model('Flight', flightSchema);
