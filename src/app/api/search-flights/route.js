// app/api/searchFlights/route.js

import { NextResponse } from 'next/server';
import Flight from '@/models/Flight';
import connectDB from '@/lib/db';



export async function GET(req) {

  try {
    await connectDB();
    const flights = await Flight.find();
    if (!flights || flights.length === 0) {
      return NextResponse.json({ message: 'No flights found' }, { status: 404 });
    }
    else {
      return NextResponse.json({ message: 'Flights found', flights }, { status: 200 });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Error fetching or generating flights' }, { status: 500 });
  }
}
