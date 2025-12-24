import React, { useState, useEffect } from 'react';
import { getFlightDetails } from '../../services/Airline/flightsService.js';
import { getFlightOffers } from '../../services/Airline/flightsService.js';
import {
  isOfferActive,
  calculateDiscountedPrice,
  getBestActiveOffer,
  formatPriceDisplay,
  getOfferBadgeText
} from '../../utils/offerUtils';

const FlightDetailsCard = ({ id }) => {
  const [flights, setFlights] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getFlightDetails(id);
        console.log('API response:', response);
        // Ensure it's always an array
        setFlights(response?.data ?? []);

        // Fetch offers for this flight
        try {
          const offersResponse = await getFlightOffers(id);
          setOffers(offersResponse || []);
        } catch (offersError) {
          console.error('Error fetching offers:', offersError);
          setOffers([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetails();
  }, [id]);

  const getDuration = (departure, arrival) => {
    if (!departure || !arrival) return "N/A";
    const diff = new Date(arrival) - new Date(departure);
    if (isNaN(diff)) return "N/A";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const getAirportCode = (airportName) => {
    if (!airportName) return "---";
    const match = airportName.match(/\(([^)]+)\)/);
    return match ? match[1] : airportName.substring(0, 3).toUpperCase();
  };

  const formatTripType = (type) => {
    if (!type) return "Unknown";
    return type.replace('_', ' ').toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return isNaN(date) ? "--:--" : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? "N/A" : date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', weekday: 'short' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 max-h-screen">
      {flights.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No flight details available</div>
      ) : flights.map((flight, index) => {
        const departureCode = getAirportCode(flight?.departureAirportName);
        const arrivalCode = getAirportCode(flight?.arrivalAirportName);
        const duration = getDuration(flight?.departureDate, flight?.arrivalDate);

        return (
          <div key={index} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-200">
            <div className="p-5">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-purple-700 rounded-md flex items-center justify-center flex-shrink-0">
                      {flight?.airlineLogoURL ? (
                        <img
                          src={flight.airlineLogoURL}
                          alt={flight?.airlineName ?? "Airline"}
                          className="w-9 h-9 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-white text-sm font-bold">QR</span>';
                          }}
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">QR</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{formatTripType(flight?.tripType)}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-semibold text-gray-900">
                        {formatDate(flight?.departureDate)}
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {formatTime(flight?.departureDate)} – {formatTime(flight?.arrivalDate)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight?.departureAirportCity ?? "Unknown city"}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-base font-semibold text-gray-900">{duration}</div>
                  <div className="text-sm text-gray-600">nonstop</div>
                </div>

                <div className="text-center">
                  <div className="text-base font-semibold text-gray-900">{departureCode}-{arrivalCode}</div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {(() => {
                      const bestOffer = getBestActiveOffer(offers);
                      const originalPrice = flight?.price;
                      const discountedPrice = bestOffer ? calculateDiscountedPrice(originalPrice, bestOffer.discountValue) : null;
                      const priceDisplay = formatPriceDisplay(originalPrice, discountedPrice);

                      return (
                        <div className="flex flex-col items-end">
                          <span className={priceDisplay.isDiscounted ? "text-red-600" : ""}>
                            {priceDisplay.displayPrice}
                          </span>
                          {priceDisplay.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {priceDisplay.originalPrice}
                            </span>
                          )}
                          {bestOffer && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold mt-1">
                              {getOfferBadgeText(bestOffer.discountValue)}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-md font-semibold text-sm transition-colors w-full">
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightDetailsCard;