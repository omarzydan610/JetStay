import React, { useState, useEffect } from 'react';
import { getFlightDetails, getPublicFlightOffers } from '../../services/Airline/flightsService.js';
import {
  calculateDiscountedPrice,
  formatPriceDisplay,
  getOfferBadgeText,
  sortOffersByDiscount
} from '../../utils/offerUtils';

const FlightDetailsCard = ({ id }) => {
  const [flights, setFlights] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getFlightDetails(id);
        setFlights(response?.data ?? []);

        try {
          const offersResponse = await getPublicFlightOffers(id);
          setOffers(offersResponse?.data || []);
        } catch (offersError) {
          console.error('Error fetching offers:', offersError);
          setOffers([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-gray-50">
        <div className="text-center text-gray-500 mt-20">Loading flight details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50">
      {flights.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No flight details available</div>
      ) : flights.map((flight, index) => {
        const departureCode = getAirportCode(flight?.departureAirportName);
        const arrivalCode = getAirportCode(flight?.arrivalAirportName);
        const duration = getDuration(flight?.departureDate, flight?.arrivalDate);
        
        // Show ALL offers without checking availability
        const sortedOffers = sortOffersByDiscount(offers);
        const hasOffers = offers.length > 0;
        const originalPrice = flight?.price || 0;

        return (
          <div key={index} className="mb-4">
            {/* Main Flight Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
                        {flight?.departureAirportCity ?? "Unknown city"} → {flight?.arrivalAirportCity ?? "Unknown city"}
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
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${originalPrice?.toFixed(2)}
                    </div>
                    
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-md font-semibold text-sm transition-colors">
                      Select Flight
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers Section - Always shown under flight if offers exist */}
            {hasOffers && (
              <div className="mt-2 bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Available Offers</h3>
                      <p className="text-sm text-blue-700">
                        {offers.length} offer{offers.length > 1 ? 's' : ''} available for this flight
                      </p>
                    </div>
                    <div className="text-sm text-blue-800 font-medium">
                      Choose any offer to apply discount
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedOffers.map((offer, offerIndex) => {
                      const discountedPrice = calculateDiscountedPrice(originalPrice, offer.discountValue);
                      const priceDisplay = formatPriceDisplay(originalPrice, discountedPrice);
                      
                      // Format dates for display
                      const formatDisplayDate = (dateString) => {
                        if (!dateString) return "N/A";
                        const date = new Date(dateString);
                        return isNaN(date) ? "N/A" : date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });
                      };

                      return (
                        <div
                          key={offerIndex}
                          className="border border-blue-200 rounded-lg p-4 bg-white hover:border-blue-400 transition-all shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                  {getOfferBadgeText(offer.discountValue)}
                                </span>
                                {offer.isActive === false && (
                                  <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <h4 className="font-medium text-gray-900">
                                {offer.offerName || 'Special Offer'}
                              </h4>
                              {offer.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {offer.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Price Details */}
                          <div className="mt-4">
                            <div className="flex items-end justify-between mb-3">
                              <div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {priceDisplay.displayPrice}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-gray-500 line-through">
                                    ${originalPrice?.toFixed(2)}
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                    Save ${(originalPrice - discountedPrice).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Offer Details */}
                            <div className="mt-3 text-xs text-gray-600 space-y-2 border-t pt-3">
                              {offer.startDate && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 min-w-[80px]">Start Date:</span>
                                  <span>{formatDisplayDate(offer.startDate)}</span>
                                </div>
                              )}
                              {offer.endDate && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 min-w-[80px]">End Date:</span>
                                  <span>{formatDisplayDate(offer.endDate)}</span>
                                </div>
                              )}
                              {offer.maxUsage && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 min-w-[80px]">Usage:</span>
                                  <span>
                                    {offer.currentUsage || 0} / {offer.maxUsage} used
                                  </span>
                                </div>
                              )}
                              {offer.isActive !== undefined && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 min-w-[80px]">Status:</span>
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    offer.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {offer.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Select Button */}
                          <button 
                            className={`w-full mt-4 px-4 py-2.5 rounded-md font-semibold text-sm transition-colors ${
                              offer.isActive !== false
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={offer.isActive === false}
                          >
                            {offer.isActive !== false ? 'Apply This Offer' : 'Offer Not Active'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Offer Summary */}
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <div className="text-sm text-blue-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">📋 Offer Summary:</h4>
                          <ul className="list-disc list-inside text-xs space-y-1">
                            <li>Total offers: {offers.length}</li>
                            <li>Highest discount: {Math.max(...offers.map(o => o.discountValue || 0))}%</li>
                            <li>Lowest discount: {Math.min(...offers.map(o => o.discountValue || 0))}%</li>
                          </ul>
                        </div>
                        <div className="text-right">
                          <h4 className="font-medium mb-1">💰 Potential Savings:</h4>
                          <div className="text-lg font-bold text-green-600">
                            Save up to ${Math.max(...offers.map(offer => 
                              originalPrice - calculateDiscountedPrice(originalPrice, offer.discountValue)
                            )).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No offers message */}
            {!hasOffers && (
              <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="text-center text-gray-500 italic">
                  No offers available for this flight
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FlightDetailsCard;