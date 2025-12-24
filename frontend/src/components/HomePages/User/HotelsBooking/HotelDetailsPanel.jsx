import { motion } from "framer-motion";
import { X, Star, MapPin as MapPinIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoomTypeItem } from "./RoomTypeItem";
import roomsService from "../../../../services/HotelServices/roomsService";
import { isOfferActive } from "../../../../utils/offerUtils";

export default function HotelDetailsPanel({
  hotel,
  onClose,
  getRoomImage,
  placeholderImages,
}) {
  const navigate = useNavigate();
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomOffers, setRoomOffers] = useState([]);

  // Fetch room offers when hotel changes
  useEffect(() => {
    const fetchRoomOffers = async () => {
      if (!hotel?.hotelID) return;
      

      try {
        const offers = await roomsService.getPublicRoomOffers(hotel.hotelID);
        setRoomOffers(offers || []);
      } catch (error) {
        console.error("Error fetching room offers:", error);
        setRoomOffers([]);
      } finally {
      }
    };

    fetchRoomOffers();
  }, [hotel?.hotelID]);

  const getBestOfferForPrice = (price) => {
    const activeOffers = roomOffers.filter(offer => isOfferActive(offer));
    if (activeOffers.length === 0) return null;
    
    // For simplicity, return the first active offer (could be improved to find best)
    return activeOffers[0];
  };

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Room Types
          </h2>
          {roomOffers.length > 0 && (
            <div className="text-sm text-green-600 font-semibold">
              {roomOffers.filter(offer => isOfferActive(offer)).length} active offer{roomOffers.filter(offer => isOfferActive(offer)).length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {hotel.roomTypes.map((roomType) => (
            <RoomTypeItem
              key={roomType.roomTypeID}
              roomType={roomType}
              isSelected={selectedRoomType?.roomTypeID === roomType.roomTypeID}
              onSelect={setSelectedRoomType}
              getRoomImage={getRoomImage}
              getBestOffer={getBestOfferForPrice}
            />
          ))}
        </div>
      </div>

      {/* Booking Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
        <button
          disabled={!selectedRoomType}
          onClick={() => {
            if (selectedRoomType) {
              navigate("/booking", {
                state: {
                  hotel: hotel,
                  selectedRoomType: selectedRoomType,
                },
              });
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
}
