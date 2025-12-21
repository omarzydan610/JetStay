import React from "react";

export const RoomTypeItem = React.memo(
  ({ roomType, isSelected, onSelect, getRoomImage }) => (
    <div
      className={`rounded-lg border-2 overflow-hidden cursor-pointer transition ${
        isSelected
          ? "border-sky-600 shadow-lg"
          : "border-gray-200 hover:border-sky-300"
      }`}
    >
      {/* Room Header - Always Visible */}
      <button
        onClick={() => onSelect(isSelected ? null : roomType)}
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
        <div className="border-t-2 border-gray-200 bg-gray-50 p-4">
          {/* Room Images */}
          {Array.isArray(getRoomImage(roomType)) ? (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {getRoomImage(roomType).map((img, idx) => (
                <div
                  key={idx}
                  className="w-full h-32 rounded-lg overflow-hidden bg-gray-300"
                >
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
  )
);

RoomTypeItem.displayName = "RoomTypeItem";
