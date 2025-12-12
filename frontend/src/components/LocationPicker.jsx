import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Navigation, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to handle map clicks
function LocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPositionChange([lat, lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

// Component to control map centering
function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position && position.length === 2) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
}

function LocationPicker({
  initialLatitude = 40.7128,
  initialLongitude = -74.006,
  onLocationChange,
  height = "300px",
  showCurrentLocationButton = true,
  showCoordinatesInputs = true,
}) {
  const [position, setPosition] = useState([
    parseFloat(initialLatitude),
    parseFloat(initialLongitude),
  ]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    setPosition([parseFloat(initialLatitude), parseFloat(initialLongitude)]);
  }, [initialLatitude, initialLongitude]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    if (onLocationChange) {
      onLocationChange({
        latitude: newPosition[0].toFixed(6),
        longitude: newPosition[1].toFixed(6),
      });
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];
        setPosition(newPosition);
        if (onLocationChange) {
          onLocationChange({
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
          });
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to get your current location. Please check your browser permissions."
        );
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      {showCurrentLocationButton && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isGettingLocation ? (
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>Use Current Location</span>
          </button>
        </div>
      )}

      {/* Map */}
      <div
        className="rounded-lg overflow-hidden border border-gray-300"
        style={{ height }}
      >
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker
            position={position}
            onPositionChange={handlePositionChange}
          />
          <MapController position={position} />
        </MapContainer>
      </div>

      {/* Instructions */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>Click on the map to set your location</span>
      </div>

      {/* Coordinates Display */}
      {showCoordinatesInputs && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Latitude</label>
            <input
              type="text"
              value={position[0].toFixed(6)}
              readOnly
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Longitude
            </label>
            <input
              type="text"
              value={position[1].toFixed(6)}
              readOnly
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
