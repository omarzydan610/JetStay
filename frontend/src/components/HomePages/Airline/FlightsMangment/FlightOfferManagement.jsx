import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addFlightOffer, getFlightOffers, deleteFlightOffer, getFlights } from "../../../../services/Airline/flightsService";
import GlassCard from "../../Airline/GlassCard";

export default function FlightOfferManagement() {
  const [offers, setOffers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState("");
  const [formData, setFormData] = useState({
    offerName: "",
    discountValue: "",
    startDate: "",
    endDate: "",
    maxUsage: "",
    description: ""
  });

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const data = await getFlights();
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setFlights(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) {
          setFlights(data.data);
        } else if (Array.isArray(data.flights)) {
          setFlights(data.flights);
        } else if (Array.isArray(data.results)) {
          setFlights(data.results);
        } else {
          console.error("Invalid flights response:", data);
          setFlights([]);
          toast.error("Could not load flights");
        }
      } else {
        setFlights([]);
      }
    } catch (error) {
      console.error("Error loading flights:", error);
      toast.error("Failed to load flights");
      setFlights([]);
    }
  };

  const loadOffers = async () => {
    if (!selectedFlightId) return;

    try {
      setLoading(true);
      const data = await getFlightOffers(selectedFlightId);
      
      if (Array.isArray(data)) {
        setOffers(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) {
          setOffers(data.data);
        } else if (Array.isArray(data.offers)) {
          setOffers(data.offers);
        } else {
          setOffers([]);
        }
      } else {
        setOffers([]);
      }
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("Failed to load offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFlightId) {
      loadOffers();
    } else {
      setOffers([]);
    }
  }, [selectedFlightId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedFlightId) {
      toast.error("Please select a flight");
      return;
    }
    
    if (!formData.offerName.trim()) {
      toast.error("Offer name is required");
      return;
    }
    
    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      toast.error("Start date and end date are required");
      return;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setLoading(true);

      // Prepare data according to your entity structure
      const submitData = {
        offerName: formData.offerName.trim(),
        discountValue: parseFloat(formData.discountValue),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
        description: formData.description.trim() || null,
        // currentUsage defaults to 0 in entity
        // isActive defaults to true in entity
        // createdAt is auto-generated
      };

      await addFlightOffer(selectedFlightId, submitData);
      toast.success("Flight offer added successfully");
      setShowForm(false);
      setFormData({
        offerName: "",
        discountValue: "",
        startDate: "",
        endDate: "",
        maxUsage: "",
        description: ""
      });
      loadOffers();
    } catch (error) {
      console.error("Error adding flight offer:", error);
      toast.error(error.response?.data?.message || "Failed to add flight offer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      setLoading(true);
      await deleteFlightOffer(offerId);
      toast.success("Offer deleted successfully");
      loadOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getSelectedFlightInfo = () => {
    return Array.isArray(flights) 
      ? flights.find(flight => {
          const flightId = flight.flightID || flight.id || flight.flightId;
          return String(flightId) === String(selectedFlightId);
        })
      : undefined;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Flight Offers Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={!selectedFlightId}
          className={`px-4 py-2 rounded-lg transition ${
            selectedFlightId 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {showForm ? "Cancel" : "Add New Offer"}
        </button>
      </div>

      {/* Flight Selection */}
      <GlassCard>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Flight</label>
          <select
            value={selectedFlightId}
            onChange={(e) => setSelectedFlightId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a flight...</option>
            {Array.isArray(flights) && flights.map(flight => {
              const flightId = flight.flightID || flight.id || flight.flightId;
              const departure = flight.departureAirport?.airportName || flight.departure || "Unknown";
              const arrival = flight.arrivalAirport?.airportName || flight.arrival || "Unknown";
              
              return (
                <option key={flightId} value={flightId}>
                  Flight {flightId} - {departure} to {arrival}
                </option>
              );
            })}
          </select>
        </div>
      </GlassCard>

      {showForm && selectedFlightId && (
        <GlassCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Add Offer for Flight {selectedFlightId}
            </h3>
            {getSelectedFlightInfo() && (
              <p className="text-sm text-gray-600 mt-1">
                {getSelectedFlightInfo().departureAirport?.airportName || "Unknown"} → 
                {getSelectedFlightInfo().arrivalAirport?.airportName || "Unknown"}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offer Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Name *
                </label>
                <input
                  type="text"
                  name="offerName"
                  value={formData.offerName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Summer Special, Early Bird Discount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter discount percentage (0-100)</p>
              </div>

              {/* Max Usage (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Usage (Optional)
                </label>
                <input
                  type="number"
                  name="maxUsage"
                  value={formData.maxUsage}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Leave blank for unlimited"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited usage</p>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the offer terms and conditions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    offerName: "",
                    discountValue: "",
                    startDate: "",
                    endDate: "",
                    maxUsage: "",
                    description: ""
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Offer...
                  </span>
                ) : (
                  "Create Offer"
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Offers List */}
      {selectedFlightId && (
        <GlassCard>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Offers for Flight {selectedFlightId}
                </h3>
                <p className="text-sm text-gray-600">
                  {Array.isArray(offers) ? `${offers.length} offer(s) found` : "Loading offers..."}
                </p>
              </div>
              <button
                onClick={loadOffers}
                disabled={loading}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading offers...</p>
              </div>
            ) : !Array.isArray(offers) || offers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">No offers found for this flight</p>
                <p className="text-sm">Click "Add New Offer" to create one</p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map(offer => {
                  const offerId = offer.flightOfferId || offer.id;
                  const isActive = offer.isActive !== false;
                  const currentUsage = offer.currentUsage || 0;
                  const maxUsage = offer.maxUsage;
                  
                  return (
                    <div key={offerId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-800">{offer.offerName}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              isActive 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {isActive ? "Active" : "Inactive"}
                            </span>
                            <span className="text-sm text-blue-600 font-medium">
                              {offer.discountValue}% OFF
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Valid:</span> {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                          </p>
                          
                          {offer.description && (
                            <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {maxUsage && (
                              <span>
                                Usage: {currentUsage}/{maxUsage}
                              </span>
                            )}
                            {!maxUsage && currentUsage > 0 && (
                              <span>Used {currentUsage} times</span>
                            )}
                            <span>
                              Created: {offer.createdAt ? formatDate(offer.createdAt) : "N/A"}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(offerId)}
                          disabled={loading}
                          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
}