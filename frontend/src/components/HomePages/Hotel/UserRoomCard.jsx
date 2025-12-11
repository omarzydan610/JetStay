
export default function UserRoomCard({ room }) {
  const fallbackHotelImage = "/images/logo.jpg"; // fallback for hotel logo
  const fallbackRoomImage = "/images/logo.jpg"; // fallback for room image

  // Show first image or fallback
  const roomImageUrl =
    room.images && room.images.length > 0 ? room.images[0].imageUrl : fallbackRoomImage;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col gap-4">
      {/* Room Image */}
      <div className="relative w-full aspect-[16/9]">
        <img
          src={roomImageUrl}
          alt={room.roomTypeName}
          onError={(e) => (e.currentTarget.src = fallbackRoomImage)}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Room Info */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-800">{room.roomTypeName}</h3>
        <p className="text-sm text-gray-600">
          {room.roomTypeName} — ${room.price} — {room.numberOfGuests} guests
        </p>
        {room.description && (
          <p className="text-sm text-gray-500">{room.description}</p>
        )}

        {/* Hotel Info */}
        <div className="flex items-center gap-2 mt-2">
          <img
            src={room.hotel.logoUrl || fallbackHotelImage}
            alt={room.hotel.hotelName}
            onError={(e) => (e.currentTarget.src = fallbackHotelImage)}
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex flex-col text-sm text-gray-600">
            <span>{room.hotel.hotelName}</span>
            <span>
              {room.hotel.city}, {room.hotel.country}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <button className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
          View Details
        </button>
        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          Book Now
        </button>
      </div>
    </div>
  );
}