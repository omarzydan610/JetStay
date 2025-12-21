import HotelRow from "./HotelRow";

export default function HotelsList({ hotels, onSelectHotel, getHotelImage }) {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No hotels found. Try adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <HotelRow
          key={hotel.hotelID}
          hotel={hotel}
          onSelect={onSelectHotel}
          getHotelImage={getHotelImage}
        />
      ))}
    </div>
  );
}
