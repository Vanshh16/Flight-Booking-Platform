import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Flight from "@/models/Flight";

export async function GET(req) {
  try {
    await connectDB();

    const user = await User.findOne({ email: "demo@flight.com" }).populate(
      "bookings"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const bookings = user.bookings;
    console.log("BOOKINGS: ", bookings);
    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { success: true, message: "No bookings found", bookings },
        { status: 200 }
      );
    }
    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { flight, date } = body;

    if (!flight) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: "demo@flight.com" });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const f = await Flight.findById( flight._id );
    if (f) {
      f.date = date;
      await f.save();
    }

    const bookings = user.bookings;
    bookings.push(flight);

    user.wallet = user.wallet - flight.currentPrice;
    await user.save();
    console.log("Booking added");

    return NextResponse.json(
      { success: true, message: "booking confirmed" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to add booking" },
      { status: 500 }
    );
  }
}
