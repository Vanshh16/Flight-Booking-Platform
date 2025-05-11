import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: String,
  flightId: mongoose.Schema.Types.ObjectId,
  price: Number,
  bookingTime: Date,
  ticketId: String,
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
