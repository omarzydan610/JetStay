import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocationPicker = ({ latitude, longitude, onLocationChange }) => {
  const [coords, setCoords] = useState({
    lat: latitude || '',
    lng: longitude || ''
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [activeMode, setActiveMode] = useState('manual'); 
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // default

  useEffect(() => {
    if (latitude && longitude) {
      const newCoords = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };
      setCoords(newCoords);
      setMapCenter(newCoords);
    }
  }, [latitude, longitude]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newCoords = { ...coords, [name]: value };
    setCoords(newCoords);

    const lat = parseFloat(newCoords.lat);
    const lng = parseFloat(newCoords.lng);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onLocationChange(lat, lng);
      setMapCenter({ lat, lng });
    }
  };

  const getLocationFromBrowser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported. Enter coordinates manually.');
      return;
    }

    setIsGettingLocation(true);
    setActiveMode('geolocation');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newCoords = { lat: lat.toFixed(6), lng: lng.toFixed(6) };
        setCoords(newCoords);
        setMapCenter({ lat, lng });
        onLocationChange(lat, lng);
        setIsGettingLocation(false);
      },
      (err) => {
        setIsGettingLocation(false);
        alert('Could not get your location. ' + err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const newCoords = { lat: lat.toFixed(6), lng: lng.toFixed(6) };
        setCoords(newCoords);
        setMapCenter({ lat, lng });
        onLocationChange(lat, lng);
      },
    });
    return null;
  };

  const isValidCoordinate = (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  };

  const getCoordinateStatus = (value, min, max) => {
    if (!value) return 'empty';
    if (!isValidCoordinate(value, min, max)) return 'invalid';
    return 'valid';
  };

  const latStatus = getCoordinateStatus(coords.lat, -90, 90);
  const lngStatus = getCoordinateStatus(coords.lng, -180, 180);

  const getInputClass = (status) => {
    const base = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    if (status === 'valid') return `${base} border-green-500 bg-green-50`;
    if (status === 'invalid') return `${base} border-red-500 bg-red-50`;
    return `${base} border-gray-300`;
  };

  const getButtonClass = (mode) => {
    const base = "px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 flex-1";
    return activeMode === mode
      ? `${base} bg-blue-600 text-white shadow-md`
      : `${base} bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300`;
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Choose Location Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button type="button" onClick={() => setActiveMode('manual')} className={getButtonClass('manual')}>
            ⌨️ <div className="text-left"><div className="font-medium">Manual Input</div><div className="text-xs opacity-80">Enter coordinates</div></div>
          </button>

          <button type="button" onClick={getLocationFromBrowser} disabled={isGettingLocation} className={getButtonClass('geolocation')}>
            {isGettingLocation ? "Getting Location..." : <>📍 <div className="text-left"><div className="font-medium">My Location</div><div className="text-xs opacity-80">Use GPS</div></div></>}
          </button>

          <button type="button" onClick={() => setActiveMode('map')} className={getButtonClass('map')}>
            🗺️ <div className="text-left"><div className="font-medium">Map Pick</div><div className="text-xs opacity-80">Click on map</div></div>
          </button>
        </div>
      </div>

      {/* Manual Input */}
      {activeMode === 'manual' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-md font-semibold text-blue-800 mb-3">Enter Coordinates Manually</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
              <input type="number" name="lat" value={coords.lat} onChange={handleChange} step="any" min="-90" max="90" placeholder="e.g., 40.7128" className={getInputClass(latStatus)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
              <input type="number" name="lng" value={coords.lng} onChange={handleChange} step="any" min="-180" max="180" placeholder="e.g., -74.0060" className={getInputClass(lngStatus)} required />
            </div>
          </div>
        </div>
      )}

      {/* Map Picker */}
      {activeMode === 'map' && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h4 className="text-md font-semibold text-gray-800">🗺️ Click on the Map to Select Location</h4>
            <p className="text-sm text-gray-600 mt-1">
              Current: {coords.lat && coords.lng ? `${coords.lat}, ${coords.lng}` : 'Not set'}
            </p>
          </div>
          <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {coords.lat && coords.lng && <Marker position={[coords.lat, coords.lng]} />}
            <MapClickHandler />
          </MapContainer>
        </div>
      )}

      {/* Current Coordinates Display */}
      {coords.lat && coords.lng && latStatus === 'valid' && lngStatus === 'valid' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800">✅ Location Set</h4>
          <p className="text-green-700 text-sm mt-1">
            Coordinates: <span className="font-mono bg-green-100 px-2 py-1 rounded">{coords.lat}, {coords.lng}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
