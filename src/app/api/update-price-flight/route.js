import connectDB from "@/lib/db";
import Flight from "@/models/Flight";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { flights } = await req.json();
    const now = new Date();

    if (!Array.isArray(flights) || flights.length === 0) {
      return NextResponse.json(
        { message: "Invalid or empty flight list." },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedFlights = [];

    for (const flight of flights) {
      const dbFlight = await Flight.findById(flight._id);
      if (!dbFlight) continue;

      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      // Revert price after 10 minutes
      if (
        dbFlight.lastPriceUpdate &&
        new Date(dbFlight.lastPriceUpdate) < tenMinutesAgo
      ) {
        dbFlight.currentPrice = dbFlight.basePrice;
        dbFlight.lastPriceUpdate = now;
        await dbFlight.save();
      }

      updatedFlights.push(dbFlight);
    }

    return NextResponse.json({
      message: "Prices updated successfully.",
      updatedFlights,
    });
  } catch (err) {
    console.error("Error updating prices:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
