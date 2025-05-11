// app/api/generateFlights/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Flight from '@/models/Flight';

const connectDB = async () => {
  if (mongoose.connections[0].readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function POST(req) {
  try {
    await connectDB();
    const { fromCity, toCity } = await req.json();

    const airlines = ['Airline A', 'Airline B', 'Airline C', 'Airline D'];
    const flightNumbers = ['AA123', 'BB456', 'CC789', 'DD101', 'EE112'];
    const departureTimes = ['2025-05-10T08:00:00', '2025-05-10T12:00:00', '2025-05-10T16:00:00', '2025-05-10T20:00:00'];
    const arrivalTimes = ['2025-05-10T10:00:00', '2025-05-10T14:00:00', '2025-05-10T18:00:00', '2025-05-10T22:00:00'];

    const flights = Array.from({ length: 10 }, () => {
      const basePrice = Math.floor(Math.random() * 400) + 100;
      return {
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        flightNumber: flightNumbers[Math.floor(Math.random() * flightNumbers.length)],
        from: fromCity,
        to: toCity,
        departureTime: departureTimes[Math.floor(Math.random() * departureTimes.length)],
        arrivalTime: arrivalTimes[Math.floor(Math.random() * arrivalTimes.length)],
        basePrice,
        currentPrice: basePrice,
        bookingCount: 0,
        lastPriceUpdate: null,
      };
    });

    await Flight.insertMany(flights);

    return NextResponse.json({ message: 'Flights generated and stored successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error generating flights' }, { status: 500 });
  }
}
