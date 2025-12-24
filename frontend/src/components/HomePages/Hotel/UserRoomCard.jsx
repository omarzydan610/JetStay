import { useState } from "react";
import {
  calculateDiscountedPrice,
  getBestActiveOffer,
  formatPriceDisplay,
  getOfferBadgeText
} from "../../../utils/offerUtils";

export default function UserRoomCard({ room, offers = [] }) {
  const [expanded, setExpanded] = useState(false);
  const fallbackHotelImage = "/images/logo.jpg";
  const fallbackRoomImage = "/images/logo.jpg";

  // Calculate offer information
  const bestOffer = getBestActiveOffer(offers.filter(offer =>
    !offer.roomTypeName || offer.roomTypeName === room.roomTypeName
  ));

  const originalPrice = room.price;
  const discountedPrice = bestOffer ? calculateDiscountedPrice(originalPrice, bestOffer.discountValue) : null;
  const priceDisplay = formatPriceDisplay(originalPrice, discountedPrice);

  const roomImages =
    room.images && room.images.length > 0
      ? room.images
      : [{ imageUrl: fallbackRoomImage }];

  const mainImage = roomImages[0]?.imageUrl || fallbackRoomImage;
  const sideImages = roomImages.slice(1, 3).map(img => img.imageUrl || fallbackRoomImage);

  if (expanded) {
    return (
      <div className="bg-white rounded-xl shadow-xl transition p-6 flex flex-col gap-6 relative">
        {bestOffer && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
              🎉 SPECIAL OFFER AVAILABLE! 🎉
            </div>
          </div>
        )}
        {/* Close Button */}
        <button
          onClick={() => setExpanded(false)}
          className="self-end text-3xl font-bold text-gray-700 hover:text-gray-900"
        >
          ×
        </button>

        {/* Images Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={mainImage}
            alt="Main Room"
            className="w-full md:w-2/3 h-64 object-cover rounded-lg shadow-lg"
          />
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-1/3">
            {sideImages.length > 0
              ? sideImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Room ${idx + 2}`}
                    className="w-1/2 md:w-full h-32 object-cover rounded-lg shadow"
                    onError={(e) => (e.currentTarget.src = fallbackRoomImage)}
                  />
                ))
              : [1, 2].map((_, idx) => (
                  <img
                    key={idx}
                    src={fallbackRoomImage}
                    alt={`Fallback ${idx + 2}`}
                    className="w-1/2 md:w-full h-32 object-cover rounded-lg shadow"
                  />
                ))}
          </div>
        </div>

        {/* Hotel Details */}
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-3xl font-bold text-gray-800">{room.hotel.hotelName}</h2>
          <p className="text-lg text-gray-700">
            <strong>Location:</strong> {room.hotel.city}, {room.hotel.country}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Rating:</strong> ⭐ {room.hotel.hotelRate?.toFixed(1)} ({room.hotel.numberOfRates} ratings)
          </p>
          <p className="text-lg text-gray-700">
            <strong>Number of Guests:</strong> {room.numberOfGuests} Guests
          </p>
          <p className="text-lg text-gray-700">
            <strong>Price:</strong>{" "}
            <span className={priceDisplay.isDiscounted ? "text-red-600 font-bold" : ""}>
              {priceDisplay.displayPrice}
            </span>
            {priceDisplay.originalPrice && (
              <span className="text-gray-400 line-through ml-2">
                {priceDisplay.originalPrice}
              </span>
            )}
          </p>
          {bestOffer && (
            <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border-2 border-red-300 rounded-xl p-5 mt-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 rounded-full -mr-8 -mt-8 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <span className="bg-red-500 text-white text-lg px-4 py-2 rounded-full font-bold shadow-md animate-pulse">
                      {getOfferBadgeText(bestOffer.discountValue)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-800 font-bold text-xl mb-1">
                      {bestOffer.offerName}
                    </h4>
                    <div className="text-sm text-red-600 font-semibold flex items-center gap-1">
                      <span>⚡</span> Limited Time Offer!
                    </div>
                  </div>
                </div>
                {bestOffer.description && (
                  <p className="text-red-700 text-base mb-4 leading-relaxed bg-white bg-opacity-50 p-3 rounded-lg">
                    {bestOffer.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-red-600 font-semibold bg-white bg-opacity-70 px-3 py-1 rounded-full">
                    Valid until: {new Date(bestOffer.endDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-green-600 font-bold text-lg bg-white bg-opacity-70 px-3 py-1 rounded-full">
                    💰 Save ${((originalPrice - discountedPrice) || 0).toFixed(2)}!
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="text-lg text-gray-700">
            <strong>Remaining rooms:</strong> {room.quantity}
          </p>
          {room.description && <p className="text-lg text-gray-600 mt-2">{room.description}</p>}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Book Now
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col gap-4 relative">
      {bestOffer && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
            🔥 OFFER
          </div>
        </div>
      )}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
        <img
          src={mainImage}
          alt={room.roomTypeName}
          onError={(e) => (e.currentTarget.src = fallbackRoomImage)}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-800">{room.roomTypeName}</h3>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">
            {priceDisplay.displayPrice}
          </p>
          {bestOffer && (
            <div className="flex flex-col gap-1 p-2 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  {getOfferBadgeText(bestOffer.discountValue)}
                </span>
                <span className="text-red-700 text-xs font-bold">
                  {bestOffer.offerName}
                </span>
              </div>
              <div className="text-xs text-green-600 font-semibold">
                Save ${((originalPrice - discountedPrice) || 0).toFixed(2)}!
              </div>
            </div>
          )}
        </div>
        {priceDisplay.originalPrice && (
          <p className="text-xs text-gray-400 line-through">
            {priceDisplay.originalPrice}
          </p>
        )}
        {room.description && <p className="text-sm text-gray-500">{room.description}</p>}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <img
          src={room.hotel.logoUrl || fallbackHotelImage}
          alt={room.hotel.hotelName}
          onError={(e) => (e.currentTarget.src = fallbackHotelImage)}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div className="flex flex-col text-sm text-gray-600">
          <span className="font-medium">{room.hotel.hotelName}</span>
          <span>{room.hotel.city}, {room.hotel.country}</span>
          <span>⭐ {room.hotel.hotelRate?.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setExpanded(true)}
          className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
        >
          View Details
        </button>
        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          Book Now
        </button>
      </div>
    </div>
  );
}