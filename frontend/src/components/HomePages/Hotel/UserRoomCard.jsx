import { useState } from "react";

export default function UserRoomCard({ room }) {
  const [expanded, setExpanded] = useState(false);
  const fallbackHotelImage = "/images/logo.jpg";
  const fallbackRoomImage = "/images/logo.jpg";

  const roomImages =
    room.images && room.images.length > 0
      ? room.images
      : [{ imageUrl: fallbackRoomImage }];

  const mainImage = roomImages[0]?.imageUrl || fallbackRoomImage;
  const sideImages = roomImages.slice(1, 3).map(img => img.imageUrl || fallbackRoomImage);

  if (expanded) {
    return (
      <div className="bg-white rounded-xl shadow-xl transition p-6 flex flex-col gap-6">
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
            <strong>Price:</strong> {room.price}$
          </p>
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col gap-4">
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
        <p className="text-sm text-gray-600">
          ${room.price}
        </p>
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