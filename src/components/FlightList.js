import { useEffect, useState } from "react";
import BookingModal from "./BookingModal";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { IoAirplaneSharp } from "react-icons/io5";

export default function FlightList({ fromCity, toCity, date }) {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const flightsPerPage = 5;

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/search-flights");
      setFlights(response.data.flights);
      if (response.data.flights.length === 0) {
        console.log("No flights found for the selected criteria.");
      } else {
        console.log("Flights found successfully.");
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (fromCity && toCity && date) {
      fetchFlights();
    }
  }, [fromCity, toCity, date]);

  useEffect(() => {
    const checkPrices = async () => {
      try {
        if (!flights || flights.length === 0) return;

        const response = await axios.put("/api/update-price-flight", {
          flights: flights.map((f) => ({ _id: f._id })),
        });

        setFlights((prevFlights) =>
          prevFlights.map((flight) => {
            const updated = response.data.updatedFlights.find(
              (f) => f._id === flight._id
            );
            return updated ? { ...flight, ...updated } : flight;
          })
        );
      } catch (error) {
        console.error("Error updating data:", error);
      }
    };

    checkPrices();

    const interval = setInterval(checkPrices, 1 * 60 * 1000); // 1 minute
    return () => clearInterval(interval);
  }, [flights]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleBookNow = async (flight) => {
    setModalLoading(true);

    setSelectedFlight(flight);
    const response = await axios.post("/api/book-flight", { flight });
    setFlights(response.data.flights);
    console.log("Booking response:", response.data);
    setTimeout(() => {
      setModalLoading(false);
    }, 1000);
  };

  const closeModal = () => {
    setSelectedFlight(null);
  };

  const indexOfLastFlight = (currentPage + 1) * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!flights.length) return;

  return (
    <div className="mt-6 md:max-w-7xl w-full mx-auto px-1 py-6 md:px-16 md:py-10 md:shadow-sm md:bg-black/35 md:backdrop-blur-lg rounded-md">
      {currentFlights.map((flight, idx) => (
        <div
          key={idx}
          className="p-1 md:p-4 mb-6 space-x-2 flex w-full justify-evenly bg-white/70 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          {/* <div className="flex w-full flex-row"> */}
          <div className="hidden md:flex justify-center items-center">
            <img
              src={flight.logoUrl}
              alt={flight.airline}
              className="h-10 w-10 md:w-16 md:h-16 rounded-full"
            />
          </div>
          {/* <div className="flex justify-center items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {flight.airline}
              </h3>
            </div> */}
          <div className="hidden md:flex justify-center items-center">
            <h3 className="text-sm md:text-xl font-semibold text-gray-800">
              {flight.flightNumber}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-xl">{fromCity}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm md:text-xl">{flight.departureTime}</p>
          </div>
          <div className="flex justify-center items-center">
            <IoAirplaneSharp className="size-2 md:size-5" />
          </div>
          <div className="flex justify-center items-center">
            <p className="text-sm md:text-xl">{flight.arrivalTime}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-xl">{toCity}</p>
          </div>
          <div className="flex justify-center items-center text-sm md:text-xl">
            {flight.currentPrice !== flight.basePrice ? (
              <p className="">
                <span className="line-through"> ₹{flight.basePrice} </span>{" "}
                <span className="font-semibold"> ₹{flight.currentPrice} </span>
              </p>
            ) : (
              <p className="text-gray-800">
                <strong></strong> ₹{flight.currentPrice}
              </p>
            )}
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={() => handleBookNow(flight)}
              className="w-full p-1 md:p-3 text-xs md:text-base bg-black/60 backdrop-blur-lg text-white rounded-lg hover:bg-black/70 transition-colors duration-300 cursor-pointer"
            >
              Book
            </button>
          </div>
          {/* </div> */}
        </div>
      ))}

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={Math.ceil(flights.length / flightsPerPage)}
        onPageChange={handlePageChange}
        containerClassName={"flex justify-center items-center mt-4 gap-4"}
        pageClassName={"md:px-4 md:py-2 text-black rounded cursor-pointer"}
        pageLinkClassName={"text-gray-950"}
        activeClassName={"bg-white/50 backdrop-blur-lg text-white"}
        disabledClassName={"text-transparent"}
        previousClassName={"cursor-pointer hover:font-medium"}
        nextClassName={"cursor-pointer hover:font-medium "}
      />

      {selectedFlight &&
        (modalLoading ? (
          <div className="fixed inset-0 h-full bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full shadow-xl relative max-h-[85vh] overflow-y-auto">
              <div className="w-full py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent"></div>
              </div>
            </div>
          </div>
        ) : (
          <BookingModal flight={selectedFlight} onClose={closeModal} />
        ))}
    </div>
  );
}
