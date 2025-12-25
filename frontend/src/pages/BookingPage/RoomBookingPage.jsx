import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import bookingService from "../../services/HotelServices/bookingService";
import Navbar from "../../components/Navbar";
import { Calendar, Users, Hotel, CreditCard, ArrowLeft } from "lucide-react";

export default function RoomBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get hotel and room type from navigation state
  const { hotel, selectedRoomType } = location.state || {};

  const [formData, setFormData] = useState({
    hotelID: hotel?.hotelID || "",
    checkIn: "",
    checkOut: "",
    noOfGuests: 1,
    roomTypeBookingDTO: [
      {
        roomTypeID: selectedRoomType?.roomTypeID || "",
        noOfRooms: 1,
      },
    ],
  });

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  // Get available room types from hotel data
  const availableRoomTypes = hotel?.roomTypes || [];

  // Get room type details by ID
  const getRoomTypeById = (roomTypeID) => {
    return availableRoomTypes.find((rt) => rt.roomTypeID === roomTypeID);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoomTypeChange = (index, field, value) => {
    const updatedRoomTypes = [...formData.roomTypeBookingDTO];
    updatedRoomTypes[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      roomTypeBookingDTO: updatedRoomTypes,
    }));
  };

  const addRoomType = (roomTypeID = "") => {
    // For manual entry (no hotel data)
    if (!hotel) {
      setFormData((prev) => ({
        ...prev,
        roomTypeBookingDTO: [
          ...prev.roomTypeBookingDTO,
          { roomTypeID: "", noOfRooms: 1 },
        ],
      }));
      return;
    }

    // For hotel bookings with dropdown
    if (!roomTypeID) return;

    // Check if room type is already added
    const isAlreadyAdded = formData.roomTypeBookingDTO.some(
      (rt) => rt.roomTypeID === roomTypeID
    );

    if (isAlreadyAdded) {
      toast.warning("This room type is already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      roomTypeBookingDTO: [
        ...prev.roomTypeBookingDTO,
        { roomTypeID: roomTypeID, noOfRooms: 1 },
      ],
    }));
  };

  const removeRoomType = (index) => {
    if (formData.roomTypeBookingDTO.length > 1) {
      const updatedRoomTypes = formData.roomTypeBookingDTO.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        roomTypeBookingDTO: updatedRoomTypes,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.hotelID || !formData.checkIn || !formData.checkOut) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    try {
      setLoading(true);

      // Call booking API
      const bookingTransactionId = await bookingService.createBooking(formData);

      toast.success("Booking created successfully!");

      const bookingTransaction = { bookingTransactionId };
      const bookingData = { ...formData };
      // Navigate to payment page with booking transaction ID
      navigate(`/payment`, {
        state: { bookingTransaction, type: "hotel", bookingData },
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Hotel Information Card */}
          {hotel && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                {hotel.image && (
                  <img
                    src={hotel.image}
                    alt={hotel.hotelName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {hotel.hotelName}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    {hotel.city}, {hotel.country}
                  </p>
                  {selectedRoomType && (
                    <div className="mt-3 bg-sky-50 border border-sky-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-sky-900 mb-1">
                        Selected Room Type:
                      </p>
                      <p className="text-sky-700 font-medium">
                        {selectedRoomType.roomTypeName}
                      </p>
                      <p className="text-sky-600 text-sm">
                        ${selectedRoomType.price} per night • Capacity:{" "}
                        {selectedRoomType.capacity} guests
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Hotel className="w-8 h-8 text-sky-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-800">
                  Complete Your Booking
                </h1>
              </div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hotel ID - Hidden if pre-filled */}
              {!hotel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel ID *
                  </label>
                  <input
                    type="number"
                    value={formData.hotelID}
                    onChange={(e) =>
                      handleInputChange("hotelID", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Check-in and Check-out Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={formData.checkIn}
                    onChange={(e) =>
                      handleInputChange("checkIn", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    min={formData.checkIn || today}
                    value={formData.checkOut}
                    onChange={(e) =>
                      handleInputChange("checkOut", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Number of Guests *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.noOfGuests}
                  onChange={(e) =>
                    handleInputChange("noOfGuests", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Room Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Room Types *
                </label>
                {formData.roomTypeBookingDTO.map((roomType, index) => {
                  const roomTypeDetails = getRoomTypeById(roomType.roomTypeID);
                  const displayName =
                    roomTypeDetails?.roomTypeName || `Room Type ${index + 1}`;

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-700">
                            {displayName}
                          </h3>
                          {roomTypeDetails && (
                            <p className="text-sm text-gray-600">
                              ${roomTypeDetails.price}/night • Capacity:{" "}
                              {roomTypeDetails.capacity} guests
                            </p>
                          )}
                        </div>
                        {formData.roomTypeBookingDTO.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoomType(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!hotel && (
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Room Type ID
                            </label>
                            <input
                              type="number"
                              value={roomType.roomTypeID}
                              onChange={(e) =>
                                handleRoomTypeChange(
                                  index,
                                  "roomTypeID",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                              required
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Number of Rooms
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={roomType.noOfRooms}
                            onChange={(e) =>
                              handleRoomTypeChange(
                                index,
                                "noOfRooms",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Room Type Dropdown */}
                {hotel && availableRoomTypes.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Another Room Type
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addRoomType(e.target.value);
                          e.target.value = ""; // Reset selection
                        }
                      }}
                      className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-700"
                    >
                      <option value="">Select a room type to add...</option>
                      {availableRoomTypes.map((roomType) => {
                        const isAlreadyAdded = formData.roomTypeBookingDTO.some(
                          (rt) => rt.roomTypeID === roomType.roomTypeID
                        );
                        return (
                          <option
                            key={roomType.roomTypeID}
                            value={roomType.roomTypeID}
                            disabled={isAlreadyAdded}
                          >
                            {roomType.roomTypeName} - ${roomType.price}/night
                            {isAlreadyAdded ? " (Already added)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* Manual Entry for non-hotel bookings */}
                {!hotel && (
                  <button
                    type="button"
                    onClick={() => addRoomType()}
                    className="w-full py-2 border-2 border-dashed border-sky-300 text-sky-600 rounded-lg hover:border-sky-500 hover:text-sky-700 transition-all duration-200"
                  >
                    + Add Another Room Type
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
