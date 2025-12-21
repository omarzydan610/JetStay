import { motion } from "framer-motion";
import { Star, MapPin as MapPinIcon } from "lucide-react";

export default function HotelRow({ hotel, onSelect, getHotelImage }) {
  return (
    <motion.button
      onClick={() => {
        onSelect(hotel);
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
}
