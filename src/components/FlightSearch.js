"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"; // You can use Heroicons too

export default function FlightSearch({ onSearch }) {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [fromCityResults, setFromCityResults] = useState([]);
  const [toCityResults, setToCityResults] = useState([]);

  const AMADEUS_CLIENT_ID = "tHpjTJGZlPnBGadCquoeRdn4xTt0aJrN";
  const AMADEUS_CLIENT_SECRET = "MRtvtgXwSTjdeeLd";

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await axios.post(
          "https://test.api.amadeus.com/v1/security/oauth2/token",
          new URLSearchParams({
            grant_type: "client_credentials",
            client_id: AMADEUS_CLIENT_ID,
            client_secret: AMADEUS_CLIENT_SECRET,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Failed to fetch access token.");
      }
    };

    getAccessToken();
  }, []);

  const fetchCities = async (keyword, setResults) => {
    if (!accessToken) return;
    try {
      const response = await axios.get(
        "https://test.api.amadeus.com/v1/reference-data/locations",
        {
          params: {
            subType: "CITY,AIRPORT",
            keyword,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setResults(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cities.", error);
    }
  };

  const handleFromCityChange = (e) => {
    setFromCity(e.target.value.toUpperCase());
    if (e.target.value) {
      fetchCities(e.target.value, setFromCityResults);
    } else {
      setFromCityResults([]);
    }
  };

  const handleToCityChange = (e) => {
    setToCity(e.target.value.toUpperCase());
    if (e.target.value) {
      fetchCities(e.target.value, setToCityResults);
    } else {
      setToCityResults([]);
    }
  };

  const handleSearch = () => {
    if (fromCity && toCity && date) {
      onSearch({ fromCity, toCity, date });
    }
  };

  return (
    <div className="max-w-5xl mx-auto md:mr-36 p-6 mt-10 bg-transparent">
      <h2 className="text-[1.5rem] md:text-4xl font-bold text-left text-gray-900 mb-6">
        Look for Flights <img className="h-14 md:h-28 inline" src="/plane.jpg" />
      </h2>
      <div className="grid md:grid-cols-4 gap-10 md:gap-4">
        {/* From City */}
        <div className="relative px-4 py-2 md:px-6 md:py-3 bg-white/30 backdrop-blur-lg rounded-md shadow-lg w-full max-w-md mx-auto">
          <label className="flex items-center gap-2 text-base md:text-lg mb-3 font-semibold">
            {/* <MapPin className="w-5 h-5" /> */}
            FROM
          </label>
          <input
            type="text"
            placeholder="Your City"
            className="w-full p-4 mb-5 bg-white/10 border rounded-md focus:outline-none uppercase"
            value={fromCity}
            onChange={handleFromCityChange}
          />
          {fromCityResults.length > 0 && (
            <ul className="absolute left-0 w-full mt-3 bg-white md:bg-white/30 md:backdrop-blur-lg border rounded-md max-h-48 overflow-y-auto shadow-lg">
              {fromCityResults.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-3 hover:bg-white/40 cursor-pointer transition-colors"
                  onClick={() => {
                    setFromCity(result.name);
                    setFromCityResults([]);
                  }}
                >
                  {result.name} ({result.iataCode})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* To City */}
        <div className={`relative ${fromCityResults.length > 0 ? "-z-100" : ""} px-4 py-2 md:px-6 md:py-3 bg-white/30 backdrop-blur-lg rounded-md shadow-lg w-full max-w-md mx-auto`}>
          <label className="flex items-center gap-2 text-base md:text-lg mb-3 font-semibold">
            <MapPin className="w-4 h-4" /> TO
          </label>
          <input
            type="text"
            placeholder="Your destination"
            className="w-full p-4 mb-5 bg-white/10 border rounded-md focus:outline-none uppercase"
            value={toCity}
            onChange={handleToCityChange}
          />
          {toCityResults.length > 0 && (
            <ul className="absolute left-0 z-10 w-full mt-5 bg-white/30 backdrop-blur-lg border rounded max-h-32 overflow-y-auto">
              {toCityResults.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-2 hover:bg-white/30 backdrop-blur-lg cursor-pointer"
                  onClick={() => {
                    setToCity(result.name);
                    setToCityResults([]);
                  }}
                >
                  {result.name} ({result.iataCode})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date */}
        <div className={`${toCityResults.length > 0 ? "-z-100" : ""} px-4 py-2 md:px-6 md:py-3 bg-white/30 backdrop-blur-lg rounded-md shadow-lg w-full max-w-md mx-auto`}>
          <label className="flex items-center gap-2 text-base md:text-lg mb-3 font-semibold">
            {/* <CalendarDays className="w-4 h-4" /> */}
            DATE
          </label>
          <input
            type="date"
            className="w-full p-4 mb-5 border rounded-md focus:outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="px-6 py-3 bg-black/30 backdrop-blur-sm rounded-md shadow-lg w-1/2 max-w-md">
          <button onClick={handleSearch} className="w-full h-full cursor-pointer">
            <ArrowRight className="w-1/3 h-auto mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
