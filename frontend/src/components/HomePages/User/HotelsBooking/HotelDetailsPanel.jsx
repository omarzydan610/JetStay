import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin as MapPinIcon } from "lucide-react";
import { RoomTypeItem } from "./RoomTypeItem";
import HotelReviews from "../HotelReview/HotelReviewsList";
import { useState, useEffect, useCallback, useNavigate } from "react";
import roomsService from "../../../../services/HotelServices/roomsService";
import { isOfferActive } from "../../../../utils/offerUtils";

export default function HotelDetailsPanel({ hotel, onClose, getRoomImage, placeholderImages }) {
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  const [showReviews, setShowReviews] = useState(false);
  const [roomOffers, setRoomOffers] = useState([]);
  const navigate = useNavigate();

  // Fetch room offers when hotel changes
  useEffect(() => {
    const fetchRoomOffers = async () => {
      if (!hotel?.hotelID) return;
      try {
        const offers = await roomsService.getPublicRoomOffers(hotel.hotelID);
        setRoomOffers(offers || []);
      } catch {
        setRoomOffers([]);
      }
    };
    fetchRoomOffers();
  }, [hotel?.hotelID]);

  const getBestOfferForPrice = useCallback((price) => {
    const activeOffers = roomOffers.filter(offer => isOfferActive(offer));
    if (activeOffers.length === 0) return null;

    // For simplicity, return the first active offer (could be improved to find best)
    return activeOffers[0];
  }, [roomOffers]);

  const activeOffersCount = roomOffers.filter(offer => isOfferActive(offer)).length;

  return (
    <>
      {/* Sliding Panel */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-2/5 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-br from-sky-400 to-cyan-400 flex items-end">
          {hotel?.image ? (
            <img
              src={hotel.image}
              alt={hotel?.hotelName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={
                placeholderImages?.[
                parseInt(hotel?.hotelID || "0", 10) % (placeholderImages?.length || 1)
                ]
              }
              alt={hotel?.hotelName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30"></div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 z-10">
            <X size={24} className="text-gray-800" />
          </button>
          <div className="relative z-10 p-6 text-white w-full">
            <h1 className="text-4xl font-bold mb-2">{hotel?.hotelName || "Hotel"}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star size={20} fill="currentColor" />
                <span className="text-lg font-semibold">{hotel?.hotelRate || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon size={20} />
                <span>{hotel?.city || "Unknown City"}, {hotel?.country || "Unknown Country"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeOffersCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 font-bold">🎉 Special Offers Available!</div>
              {roomOffers.filter(isOfferActive).slice(0, 2).map((offer, idx) => (
                <div key={idx} className="text-green-600 text-sm">• {offer.offerName}: {offer.discountValue}% off</div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {hotel?.roomTypes && hotel.roomTypes.length > 0 ? (
              hotel.roomTypes.map((roomType) => (
                <RoomTypeItem
                  key={roomType.roomTypeID}
                  roomType={roomType}
                  isSelected={selectedRoomType?.roomTypeID === roomType.roomTypeID}
                  onSelect={setSelectedRoomType}
                  getRoomImage={getRoomImage}
                  getBestOffer={getBestOfferForPrice}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                No room types available for this hotel
              </div>
            )}
          </div>

          {/* Booking Button */}
          <div className="p-6 border-t-2 border-gray-200 bg-gray-50 mt-6">
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
              className={`w-full py-3 rounded-lg font-bold text-lg transition ${selectedRoomType
                ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-700 hover:to-cyan-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {selectedRoomType ? "Book Now" : "Select a Room Type"}
            </button>
          </div>
        </div>


      </motion.div>
      {/* Reviews Modal */}
      <AnimatePresence>
        {showReviews && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviews(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-lg shadow-2xl z-[70] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Reviews - {hotel?.hotelName || "Hotel"}
                </h2>
                <button
                  onClick={() => setShowReviews(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto">
                <HotelReviews
                  hotelId={hotel?.hotelID}
                  hotelName={hotel?.hotelName}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}