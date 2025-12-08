import React, { useState, useEffect } from 'react';
import { Plane, ChevronDown } from 'lucide-react';
import { getFlightDetails } from '../../services/flightService';

const FlightDetailsCard = ({ id }) => {
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getFlightDetails(id);
        console.log('API response:', response);
        setFlights(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetails();
  }, [id]);

  const getDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const getAirportCode = (airportName) => {
    const match = airportName.match(/\(([^)]+)\)/);
    return match ? match[1] : airportName.substring(0, 3).toUpperCase();
  };

  const formatTripType = (type) => {
    return type.replace('_', ' ').toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

    const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      {flights.map((flight, index) => {
        const departureCode = getAirportCode(flight.departureAirportName);
        const arrivalCode = getAirportCode(flight.arrivalAirportName);
        const duration = getDuration(flight.departureDate, flight.arrivalDate);
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-200">
            {/* Main Card Content */}
            <div className="p-5">
              <div className="flex items-center justify-between gap-6">
                {/* Airline Logo and Trip Type */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-purple-700 rounded-md flex items-center justify-center flex-shrink-0">
                      <img 
                        src={flight.airlineLogoURL} 
                        alt={flight.airlineName}
                        className="w-9 h-9 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="text-white text-sm font-bold">QR</span>';
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {formatTripType(flight.tripType)}
                    </span>
                  </div>
                  
                  {/* Flight Date and Time */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-semibold text-gray-900">
                        {formatDate(flight.departureDate).split(' ')[1]}/{formatDate(flight.departureDate).split(' ')[0].replace(/\D/g, '')}
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {formatTime(flight.departureDate)} – {formatTime(flight.arrivalDate)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(flight.departureDate).split(' ')[2]} • {flight.departureAirportCity}
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="text-center">
                  <div className="text-base font-semibold text-gray-900">{duration}</div>
                  <div className="text-sm text-gray-600">nonstop</div>
                </div>

                {/* Route */}
                <div className="text-center">
                  <div className="text-base font-semibold text-gray-900">{departureCode}-{arrivalCode}</div>
                </div>

                {/* Price and Select Button */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 mb-3">{flight.price}£</div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-md font-semibold text-sm transition-colors w-full">
                    Select
                  </button>
                </div>
              </div>

              {/* Expandable Details Section */}
              <div className="mt-5 pt-5 border-t border-gray-200">
                <button
                  onClick={() => setExpandedFlight(expandedFlight === index ? null : index)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  <span>Depart • {formatDate(flight.departureDate)}</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${expandedFlight === index ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedFlight === index && (
                  <div className="mt-5 pl-4">
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                        <div className="w-0.5 h-20 bg-gray-300"></div>
                        <Plane className="w-5 h-5 text-gray-600 rotate-90" />
                        <div className="w-0.5 h-20 bg-gray-300"></div>
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                      </div>
                      
                      <div className="flex-1 space-y-8">
                        <div>
                          <div className="text-base font-semibold text-gray-900">{formatTime(flight.departureDate)}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {flight.departureAirportName.split('(')[0].trim()} ({departureCode})
                          </div>
                        </div>
                        
                        <div className="pl-4 py-3 bg-gray-50 rounded-md border border-gray-200">
                          <div className="text-sm font-semibold text-gray-900">{flight.airlineName} • {flight.planeType}</div>
                          <div className="text-sm text-gray-600 mt-1">{duration} • {formatTripType(flight.tripType)}</div>
                        </div>
                        
                        <div>
                          <div className="text-base font-semibold text-gray-900">{formatTime(flight.arrivalDate)}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {flight.arrivalAirportName.split('(')[0].trim()} ({arrivalCode})
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-5 text-sm text-orange-600 font-semibold">
                      Limited seats remaining at this price
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightDetailsCard;