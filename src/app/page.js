"use client";
import { useEffect, useState } from "react";
import FlightSearch from "../components/FlightSearch";
import FlightList from "../components/FlightList";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AirplaneLoader from "@/components/Loader";

export default function Home() {
  const [flights, setFlights] = useState([]);

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = async ({ fromCity, toCity, date }) => {
    setFromCity(fromCity);
    setToCity(toCity);
    setDate(date);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("SEARCH:", fromCity, toCity, date);
  };

  return (
    <>
      {loading ? (
        <AirplaneLoader />
      ) : (
        <div className="flex w-full min-h-screen bg-gray-50">
          <div className="bg-[url('/bg-home-3.jpg')] bg-cover bg-fixed min-h-screen w-full p-4">
            <div className="justify-center items-end w-full mt-40 flex flex-col text-left px-10 mr-0">
              <h1 className="text-4xl md:text-7xl font-bold md:mb-4 md:w-1/2">
                Your Journey Starts Here!
              </h1>
              <p className="text-sm md:text-lg md:w-1/2">
                Discover amazing flights, unbeatable deals, and endless
                possibilities. Let&apos;s get you to your next adventure!
              </p>
            </div>

            <FlightSearch onSearch={handleSearch} />
            <FlightList fromCity={fromCity} toCity={toCity} date={date} />
          </div>
        </div>
      )}
      {/* <Footer /> */}
    </>
  );
}
