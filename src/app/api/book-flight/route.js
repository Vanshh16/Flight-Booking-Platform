// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import Flight from '@/models/Flight';

import connectDB from "@/lib/db";
import Flight from "@/models/Flight";
import { NextResponse } from "next/server";

// const connectDB = async () => {
//   if (mongoose.connections[0].readyState === 1) return;
//   await mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { flight, userName } = await req.json();
//     const flightId = flight._id;
//     const now = new Date();

//     const updatedFlight = await Flight.findById(flightId);
//     if (!updatedFlight) {
//       return NextResponse.json({ message: 'Flight not found' }, { status: 404 });
//     }

//     // Add current booking attempt
//     updatedFlight.bookingAttempts.push(now);

//     // Filter bookingAttempts to keep only last 5 minutes
//     const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
//     const recentAttempts = updatedFlight.bookingAttempts.filter(
//       (attempt) => new Date(attempt) > fiveMinutesAgo
//     );

//     updatedFlight.bookingAttempts = recentAttempts;

//     // Handle price update logic
//     const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

//     // If 3+ booking attempts in last 5 minutes and price wasn't increased in last 10 mins
//     if (
//       recentAttempts.length >= 3 &&
//       (!updatedFlight.lastPriceUpdate || new Date(updatedFlight.lastPriceUpdate) < tenMinutesAgo)
//     ) {
//       updatedFlight.currentPrice = Math.round(updatedFlight.currentPrice * 1.1);
//       updatedFlight.lastPriceUpdate = now;
//     }

//     // Revert price after 10 minutes
//     if (updatedFlight.lastPriceUpdate && new Date(updatedFlight.lastPriceUpdate) < tenMinutesAgo) {
//       updatedFlight.currentPrice = updatedFlight.basePrice;
//     }

//     await updatedFlight.save();

//     return NextResponse.json({
//       message: `Flight ${updatedFlight.flightNumber} booked for ${userName || 'User'}!`,
//       currentPrice: updatedFlight.currentPrice,
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: 'Booking failed' }, { status: 500 });
//   }
// }

export async function POST(req) {
  try {
    const { flight } = await req.json();
    const flightId = flight._id;
    const now = new Date();

    await connectDB();

    const updatedFlight = await Flight.findById(flightId);
    if (!updatedFlight) {
      const bookingAttempts = [];
      bookingAttempts.push(now);
      const f = await Flight.create({
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        from: flight.from,
        to: flight.to,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        basePrice: flight.basePrice,
        currentPrice: flight.currentPrice,
        lastPriceUpdate: now,
        bookingAttempts: bookingAttempts,
      });
      return NextResponse.json(
        { message: "First booking attempt made",
          flight: updatedFlight,
        },
        { status: 201 }
      );
    }

    console.log(updatedFlight);
    
    // Add current booking attempt
    updatedFlight.bookingAttempts.push(now);

    // Filter bookingAttempts to keep only last 5 minutes
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const recentAttempts = updatedFlight.bookingAttempts.filter(
      (attempt) => new Date(attempt) > fiveMinutesAgo
    );

    updatedFlight.bookingAttempts = recentAttempts;

    // Handle price update logic
    const tenMinutesAgo = new Date(now.getTime() - 60 * 1000);

    // If 3+ booking attempts in last 5 minutes and price wasn't increased in last 10 mins
    if (recentAttempts.length >= 3 && updatedFlight.currentPrice === updatedFlight.basePrice) {
      updatedFlight.currentPrice = Math.round(updatedFlight.currentPrice * 1.1);
      updatedFlight.lastPriceUpdate = now;
      await updatedFlight.save();
      const allFlights = await Flight.find();
      return NextResponse.json({
        message: `Flight price increases!`,
        currentPrice: updatedFlight.currentPrice,
        flights: allFlights,
      });
    }

    // Revert price after 10 minutes
    // if ( updatedFlight.lastPriceUpdate && new Date(updatedFlight.lastPriceUpdate) < tenMinutesAgo ) {
    //   updatedFlight.currentPrice = updatedFlight.basePrice;
    //   await updatedFlight.save();
    //   const allFlights = await Flight.find();
    //   return NextResponse.json({
    //     message: `Flight price reverted back to original!`,
    //     currentPrice: updatedFlight.currentPrice,
    //     flights: allFlights,
    //   });
    // }
    
    await updatedFlight.save();
    const allFlights = await Flight.find();
    return NextResponse.json({
      message: `${updatedFlight.bookingAttempts.length} booking attempt made`,
      flights: allFlights,
    });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Booking failed" }, { status: 500 });
  }
}
