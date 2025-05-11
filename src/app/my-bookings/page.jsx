"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { IoAirplaneSharp } from "react-icons/io5";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/my-bookings");
      console.log(response.data.bookings);

      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  

  return (
    <div className="w-full mx-auto">
      <div className="bg-[url('/bg-home-2.jpg')] bg-cover bg-fixed min-h-screen w-full pt-28 p-4">
        <h1 className="text-3xl font-semibold mx-auto mb-6 px-6 py-4 w-fit bg-black/30 backdrop-blur-sm rounded-md shadow-lg text-center drop-shadow-md">
          My Bookings
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {bookings.map((booking, i) => (
              <div
                key={i}
                className="bg-white/90 shadow-md rounded p-4 border border-gray-200 space-y-2"
              >
                <div className="flex text-2xl items-center gap-4 mb-2">
                  <img className="h-8 w-8 rounded-full" src={booking.logoUrl} />
                  <p className="font-semibold">{booking.airline}</p>
                </div>

                <p className="font text-gray-400 mb-4">{booking._id}</p>
                <p className="text-xl font-semibold">
                  Flight No.: {booking.flightNumber}
                </p>

                <div className="flex items-center gap-4 mb-2">
                  <p className="text-xl mb-2 space-x-14">
                    {booking.from}
                  </p>
                  <p className="text-xl mb-2 space-x-14">
                   <IoAirplaneSharp className="size-5" />
                  </p>
                  <p className="text-xl mb-2 space-x-14">
                    {booking.to}
                  </p>
                </div>

                <p>Date: {booking.date}</p>
                <p>Departure: {booking.departureTime}</p>
                <p>Arrival: {booking.arrivalTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
