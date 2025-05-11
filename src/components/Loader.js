"use client";

import { Plane } from "lucide-react";
import { useEffect, useState } from "react";
import "./loader.css"; 
import { IoAirplane } from "react-icons/io5";

export default function AirplaneLoader() {
  const [positions, setPositions] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((p) => (p + 1) % 3)
      );
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="z-50 flex items-center justify-center bg-[url('/bg-home-3.jpg')] bg-cover bg-fixed min-h-screen">
      <div className="flex bg-white/20 backdrop-blur-lg p-10 rounded-xl space-x-4">
        {positions.map((pos, i) => (
          <IoAirplane 
            key={i}
            className={`w-10 h-10 transform transition-all duration-300
              ${pos === 0 ? "airplane-fly-right" : pos === 1 ? "airplane-fly-up-down" : "airplane-fly-left"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
