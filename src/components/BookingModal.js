import { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";

const generateInvoice = (flight) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Flight Booking Invoice", 14, 20);

  doc.setFontSize(12);
  doc.text(`From: ${flight.from}`, 14, 30);
  doc.text(`To: ${flight.to}`, 14, 40);
  doc.text(`Airline: ${flight.airline}`, 14, 50);
  doc.text(`Flight Number: ${flight.flightNumber}`, 14, 60);

  doc.text(`Departure Time: ${flight.departureTime}`, 14, 70);
  doc.text(`Arrival Time: ${flight.arrivalTime}`, 14, 80);

  doc.text("Pricing Details:", 14, 90);
  doc.text(`Base Fare: INR ${flight.currentPrice}`, 14, 100);
  doc.text("Taxes & Surcharges: INR 39", 14, 110);
  doc.text("Other Services: INR 10.38", 14, 120);
  doc.text("Discount: -INR 1.09", 14, 130);

  const totalPrice = flight.currentPrice + 39 + 10.38 + 1.09;
  doc.text(`Total: INR ${totalPrice.toFixed(2)}`, 14, 140);

  // Footer
  doc.text("Thank you for booking with us!", 14, 160);

  // Save the PDF
  doc.save(`Invoice_${flight.flightNumber}.pdf`);
};

export default function BookingModal({ flight, onClose }) {
  const [promoCode, setPromoCode] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const handleConfirm = async () => {
    const response = await axios.post("/api/my-bookings", { flight });
    console.log(response);

    if (response.status === 200) {
      console.log("Booking successful:", response.data);
    }
    setIsBookingConfirmed(true);
  };

  return (
    <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full shadow-xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-600 hover:text-red-600 font-bold cursor-pointer"
        >
          &times;
        </button>

        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            {flight.from} → {flight.to}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {flight.airline} • {flight.flightNumber}
          </p>
          <p className="text-sm mt-1 text-orange-600 font-medium">
            NON-REFUNDABLE
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-lg font-medium">
                {flight.departureTime}— {flight.from}
              </p>
              <p className="text-sm text-gray-500">3h 0m</p>
              <p className="text-lg font-medium mt-2">
                {flight.arrivalTime}— {flight.to}
              </p>
            </div>

            <div className="bg-red-100 p-3 rounded text-sm text-red-700 font-medium border border-red-300">
              🚫 Check-in baggage is not included! Cabin bag only — 7kg.
            </div>

            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg border space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Traveller Details
              </h3>

              {/* <div className="bg-blue-100 p-3 rounded text-sm text-blue-800 flex items-center justify-between">
                <span>
                  Log in to view your saved traveller list, unlock amazing deals
                  & more!
                </span>
                <button className="text-blue-700 font-semibold underline hover:text-blue-900">
                  LOGIN NOW
                </button>
              </div> */}

              <div>
                <h4 className="font-medium text-gray-800">ADULT (12 yrs+)</h4>
                <p className="text-sm text-gray-500 mt-1">0/1 added</p>
                <p className="text-sm text-red-500 mt-1">
                  You have not added any adults to the list
                </p>

                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Enter age"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Passport No.
                      </label>
                      <input
                        type="text"
                        placeholder="Enter passport number"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Gender
                      </label>
                      <select className="w-full p-2 border rounded">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button className="mt-4 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    + ADD NEW ADULT
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Booking details will be sent to
              </h3>

              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="block text-sm text-gray-600 mb-1">
                    Country Code
                  </label>
                  <select className="w-full p-2 border rounded">
                    <option value="+91">India (+91)</option>
                    <option value="+1">USA (+1)</option>
                    <option value="+44">UK (+44)</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-sm text-gray-600 mb-1">
                    Mobile No
                  </label>
                  <input
                    type="tel"
                    placeholder="Mobile No"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Fare Summary */}
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg border space-y-4 max-h-fit">
            <h3 className="text-lg font-semibold text-gray-700">
              Fare Summary
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="flex justify-between">
                <span>Base Fare</span>
                <span>INR {flight.currentPrice}</span>
              </p>
              <p className="flex justify-between">
                <span>Taxes & Surcharges</span>
                <span>INR 39</span>
              </p>
              <p className="flex justify-between">
                <span>Other Services</span>
                <span>INR 10.38</span>
              </p>
              <p className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-INR 1.09</span>
              </p>
              <hr />
              <p className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  INR {(flight.currentPrice + 39 + 10.38 + 1.09).toFixed(2)}
                </span>
              </p>
            </div>

            {/* Promo Code */}
            <div>
              <h4 className="text-sm font-medium text-gray-600">Promo Code</h4>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="w-full p-2 mt-1 border rounded"
              />
            </div>

            <div className="bg-green-100 text-green-800 text-sm p-2 rounded">
              ✅ Travel insurance added for a hassle-free trip
            </div>

            <button
              onClick={handleConfirm}
              disabled={isBookingConfirmed}
              className={`w-full py-2 rounded-lg transition cursor-pointer ${
                isBookingConfirmed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isBookingConfirmed ? "Booking Confirmed" : "Confirm Booking"}
            </button>

            {isBookingConfirmed && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                <p className="font-semibold">Booking Confirmed!</p>
                <button
                  onClick={() => {
                    generateInvoice(flight);
                    onClose();
                  }}
                  className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
                >
                  Download Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
