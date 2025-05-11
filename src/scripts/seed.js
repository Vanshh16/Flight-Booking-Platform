// scripts/seed.js

import dotenv from 'dotenv';
import connectDB from '../lib/db.js';
import Flight from '../models/Flight.js';
import User from '../models/User.js'; // 👈 New

async function seedFlights() {

  dotenv.config();
  await connectDB();

  console.log('Seeding flights...');
  
  await Flight.deleteMany({});
  await User.deleteMany({}); // Remove existing users

  const airlines = ['IndiGo', 'SpiceJet', 'Air India', 'Vistara', 'GoAir'];
  const logos = [
    'flights/indigo.jpg',
    'flights/spicejet.jpeg',
    'flights/airindia.png',
    'flights/vistara.jpeg',
    'flights/goair.jpeg',
  ];
  const cities = [
    { code: 'DEL', city: 'Delhi' },
    { code: 'BOM', city: 'Mumbai' },
    { code: 'BLR', city: 'Bangalore' },
    { code: 'HYD', city: 'Hyderabad' },
    { code: 'MAA', city: 'Chennai' },
    { code: 'CCU', city: 'Kolkata' },
  ];

  const generateTime = () => {
    const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  const flights = [];

  for (let i = 0; i < 20; i++) {
    const from = cities[Math.floor(Math.random() * cities.length)];
    let to;
    do {
      to = cities[Math.floor(Math.random() * cities.length)];
    } while (from.code === to.code);

    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = airline.substring(0, 2).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    const departureTime = generateTime();
    const arrivalTime = generateTime();
    const basePrice = Math.floor(Math.random() * 1000) + 2000;

    flights.push({
      flightNumber,
      airline,
      date: null,
      logoUrl: logos[airlines.indexOf(airline)],
      from: from.city,
      to: to.city,
      departureTime,
      arrivalTime,
      basePrice,
      currentPrice: basePrice,
      lastPriceUpdate: null,
      bookingAttempts: [],
    });
  }

  await Flight.insertMany(flights);

  // Create sample user with ₹50,000 wallet
  await User.create({
    name: 'Demo User',
    email: 'demo@flight.com',
    wallet: 50000,
    bookings: [],
  });

  console.log('✅ Flights and user seeded successfully');
  process.exit(0);
}

seedFlights();
