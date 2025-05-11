// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  wallet: { type: Number, default: 50000 },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
