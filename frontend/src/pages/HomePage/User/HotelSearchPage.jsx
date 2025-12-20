import React, { useEffect, useState, useCallback } from "react";
import { getRoomsGraph } from "../../../services/HotelServices/hotelGraphService";
import GlassCard from "../../../components/HomePages/Airline/GlassCard";
import { toast } from "react-toastify";
import {
  Building2,
  MapPin,
  Globe,
  Star,
  DollarSign,
  Bed,
  RotateCcw,
  Search,
  X,
  MapPin as MapPinIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HotelSearchPage() {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const size = 20;
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [form, setForm] = useState({
    hotelNameContains: "",
    cityContains: "",
    countryContains: "",
    hotelRating: "",
    roomTypePrice: "50",
    roomTypeContains: "",
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value) return null;
    if (name === "roomTypePrice") {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0) return "Enter a valid non-negative number";
    }
    if (name === "hotelRating") {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0 || n > 5)
        return "Rating must be between 0 and 5";
    }
    return null;
  };

  const handleInputChange = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    const err = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (err) copy[name] = err;
      else delete copy[name];
      return copy;
    });
  };

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRoomsGraph(page, size, filter);
      console.log("Raw API Response:", res);
      console.log("Raw Data:", res?.data);
      if (res?.data && res.data.length > 0) {
        console.log("First room object:", res.data[0]);
      }
      setRooms(res?.data ?? []);
    } catch (err) {
      console.error("Error loading rooms", err);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, [page, size, filter]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const applyFilters = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix filter errors before applying");
      return;
    }
    const cleaned = {};
    if (form.hotelNameContains)
      cleaned.hotelNameContains = form.hotelNameContains;
    if (form.cityContains) cleaned.cityContains = form.cityContains;
    if (form.countryContains) cleaned.countryContains = form.countryContains;
    if (form.hotelRating) {
      const r = Number(form.hotelRating);
      cleaned.hotelRateGte = Math.max(0, r - 0.5);
      cleaned.hotelRateLte = Math.min(5, r + 2);
    }
    if (form.roomTypePrice) {
      const price = Number(form.roomTypePrice);
      const DELTA = 100;
      cleaned.priceGte = Math.max(0, price - DELTA);
      cleaned.priceLte = price + DELTA;
    }
    if (form.roomTypeContains) cleaned.roomTypeContains = form.roomTypeContains;

    setFilter(cleaned);
    setPage(0);
  };

  const clearFilters = () => {
    setForm({
      hotelNameContains: "",
      cityContains: "",
      countryContains: "",
      hotelRating: "",
      roomTypePrice: "15",
      roomTypeContains: "",
    });
    setFilter({});
    setPage(0);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => prev + 1);

  // Merge rooms by hotel ID
  const mergedHotels = useCallback(() => {
    const hotelMap = new Map();
    console.log("Merging rooms, total rooms:", rooms.length);
    rooms.forEach((room) => {
      const hotelId = room.hotel?.hotelID;
      console.log("Processing room:", {
        hotelId,
        hotelName: room.hotel?.hotelName,
        city: room.hotel?.city,
      });
      if (!hotelMap.has(hotelId)) {
        // Extract hotel information from the nested hotel object
        hotelMap.set(hotelId, {
          hotelID: room.hotel?.hotelID,
          hotelName: room.hotel?.hotelName,
          city: room.hotel?.city,
          country: room.hotel?.country,
          hotelRate: room.hotel?.hotelRate,
          image: room.hotel?.logoUrl,
          description: room.hotel?.description,
          address: room.hotel?.address,
          phoneNumber: room.hotel?.phoneNumber,
          email: room.hotel?.email,
          website: room.hotel?.website,
          amenities: room.hotel?.amenities,
          checkInTime: room.hotel?.checkInTime,
          checkOutTime: room.hotel?.checkOutTime,
          numberOfRates: room.hotel?.numberOfRates,
          roomTypes: [],
        });
      }
      hotelMap.get(hotelId).roomTypes.push({
        roomTypeID: room.roomTypeID,
        roomTypeName: room.roomTypeName,
        capacity: room.numberOfGuests,
        availableRooms: room.quantity,
        price: room.price,
        description: room.description,
      });
    });
    const result = Array.from(hotelMap.values());
    console.log("Merged hotels:", result);
    return result;
  }, [rooms]);

  const hotels = mergedHotels();

  // Placeholder images for hotels without images
  const placeholderImages = [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1629373026441-ea20a2edf25f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  ];

  const getHotelImage = (hotel) => {
    if (hotel.image) return hotel.image;
    // Return all placeholder images if no image available
    return placeholderImages;
  };

  // Placeholder images for rooms
  const roomPlaceholderImages = [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
  ];

  const getRoomImage = (roomType) => {
    if (roomType.images) return roomType.images;
    // Return all placeholder images if no image available
    return roomPlaceholderImages;
  };

  // Hotel Details Panel
  const HotelDetailsPanel = ({ hotel, onClose }) => {
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    
    return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 bottom-0 w-full md:w-2/5 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="relative h-64 bg-gradient-to-br from-sky-400 to-cyan-400 flex items-end">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.hotelName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={
              placeholderImages[
                parseInt(hotel.hotelID || "0", 10) % placeholderImages.length
              ]
            }
            alt={hotel.hotelName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition z-10"
        >
          <X size={24} className="text-gray-800" />
        </button>
        <div className="relative z-10 p-6 text-white w-full">
          <h1 className="text-4xl font-bold mb-2">{hotel.hotelName}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={20} fill="currentColor" />
              <span className="text-lg font-semibold">{hotel.hotelRate}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon size={20} />
              <span>
                {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Types */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Available Room Types
        </h2>

        <div className="space-y-4">
          {hotel.roomTypes.map((roomType) => {
            const isSelected = selectedRoomType?.roomTypeID === roomType.roomTypeID;
            return (
              <div
                key={roomType.roomTypeID}
                className={`rounded-lg border-2 overflow-hidden cursor-pointer transition ${
                  isSelected
                    ? "border-sky-600 shadow-lg"
                    : "border-gray-200 hover:border-sky-300"
                }`}
              >
                {/* Room Header - Always Visible */}
                <button
                  onClick={() => setSelectedRoomType(isSelected ? null : roomType)}
                  className={`w-full p-4 text-left transition ${
                    isSelected ? "bg-sky-50" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {roomType.roomTypeName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                        {roomType.description}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-sky-600 ml-4">
                      ${roomType.price}
                    </span>
                  </div>
                </button>

                {/* Expanded Room Details */}
                {isSelected && (
                  <div
                    className="border-t-2 border-gray-200 bg-gray-50 p-4"
                  >
                    {/* Room Images */}
                    {Array.isArray(getRoomImage(roomType)) ? (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {getRoomImage(roomType).map((img, idx) => (
                          <div key={idx} className="w-full h-32 rounded-lg overflow-hidden bg-gray-300">
                            <img
                              src={img}
                              alt={`${roomType.roomTypeName} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-300 mb-4">
                        <img
                          src={getRoomImage(roomType)}
                          alt={roomType.roomTypeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Full Description */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {roomType.description}
                      </p>
                    </div>

                    {/* Room Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-sky-200">
                        <p className="text-gray-600 text-xs font-semibold">CAPACITY</p>
                        <p className="text-xl font-bold text-sky-600 mt-1">
                          {roomType.capacity} guests
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-cyan-200">
                        <p className="text-gray-600 text-xs font-semibold">AVAILABLE</p>
                        <p className="text-xl font-bold text-cyan-600 mt-1">
                          {roomType.availableRooms} rooms
                        </p>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white rounded-lg p-3 border-2 border-sky-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Total Price</span>
                        <span className="text-3xl font-bold text-sky-600">
                          ${roomType.price}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">per night</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
        <button
          disabled={!selectedRoomType}
          onClick={() => {
            if (selectedRoomType) {
              toast.success(
                `Booking ${selectedRoomType.roomTypeName} at ${hotel.hotelName}`
              );
            }
          }}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            selectedRoomType
              ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-700 hover:to-cyan-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedRoomType ? "Book Now" : "Select a Room Type"}
        </button>
      </div>
    </motion.div>
    );
  };

  // Hotel Row Component
  const HotelRow = ({ hotel }) => (
    <motion.button
      onClick={() => {
        setSelectedHotel(hotel);
      }}
      whileHover={{ scale: 1.02 }}
      className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-sky-300 hover:shadow-lg transition text-left"
    >
      <div className="flex gap-6 items-center">
        {/* Hotel Images */}
        <div className="flex gap-2 flex-shrink-0">
          {Array.isArray(getHotelImage(hotel)) ? (
            getHotelImage(hotel).map((img, idx) => (
              <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={img}
                  alt={`${hotel.hotelName} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={getHotelImage(hotel)}
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {hotel.hotelName}
          </h3>
          <div className="flex items-center gap-4 text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-yellow-500" fill="currentColor" />
              <span className="font-semibold">{hotel.hotelRate}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon size={18} />
              <span>
                {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {hotel.roomTypes.length} room type
            {hotel.roomTypes.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Min Price */}
        <div className="text-right flex-shrink-0">
          <p className="text-gray-600 text-sm">From</p>
          <p className="text-3xl font-bold text-sky-600">
            ${Math.min(...hotel.roomTypes.map((r) => r.price))}
          </p>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      {/* Filter Panel - Always Visible */}
      <div className="border-b-2 border-sky-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Search className="text-sky-600" size={28} />
            Search Hotels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hotel Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Building2 size={18} className="text-sky-600" />
                Hotel Name
              </label>
              <input
                value={form.hotelNameContains}
                onChange={(e) =>
                  handleInputChange("hotelNameContains", e.target.value)
                }
                placeholder="Enter hotel name"
                className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-cyan-600" />
                City
              </label>
              <input
                value={form.cityContains}
                onChange={(e) =>
                  handleInputChange("cityContains", e.target.value)
                }
                placeholder="Enter city name"
                className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Globe size={18} className="text-sky-600" />
                Country
              </label>
              <input
                value={form.countryContains}
                onChange={(e) =>
                  handleInputChange("countryContains", e.target.value)
                }
                placeholder="Enter country name"
                className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            {/* Hotel Rating */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Star size={18} className="text-cyan-600" />
                Hotel Rating: {form.hotelRating || 0} ⭐
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={form.hotelRating || 0}
                onChange={(e) =>
                  handleInputChange("hotelRating", e.target.value)
                }
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Room Price */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-cyan-600" />
                Max Price: ${form.roomTypePrice || 15}
              </label>
              <input
                type="range"
                min="50"
                max="2000"
                step="10"
                value={form.roomTypePrice || 15}
                onChange={(e) =>
                  handleInputChange("roomTypePrice", e.target.value)
                }
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Bed size={18} className="text-sky-600" />
                Room Type
              </label>
              <input
                value={form.roomTypeContains}
                onChange={(e) =>
                  handleInputChange("roomTypeContains", e.target.value)
                }
                placeholder="e.g., Deluxe, Suite"
                className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={applyFilters}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-cyan-700 transition shadow-md"
            >
              <Search size={18} />
              Search
            </button>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Hotels
            </h2>
            <p className="text-sm text-gray-500 bg-sky-50 px-4 py-2 rounded-lg">
              {hotels.length} hotels found
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                <p className="mt-4 text-gray-600">Loading hotels…</p>
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-12 text-center text-gray-600">
              <Building2 size={48} className="mx-auto text-sky-300 mb-4" />
              <p>No hotels found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <HotelRow key={hotel.hotelID} hotel={hotel} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {hotels.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={page === 0}
                onClick={handlePrev}
                className="px-6 py-2 bg-sky-100 text-sky-600 font-semibold rounded-lg hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>
              <span className="text-gray-600 font-semibold px-4 py-2 bg-gray-50 rounded-lg">
                Page {page + 1}
              </span>
              <button
                disabled={hotels.length === 0}
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hotel Details Panel */}
      {selectedHotel && (
        <HotelDetailsPanel
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
        />
      )}
    </div>
  );
}
