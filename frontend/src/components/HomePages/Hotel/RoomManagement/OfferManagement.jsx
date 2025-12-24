import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import roomsService from "../../../../services/HotelServices/roomsService";
import GlassCard from "../../Airline/GlassCard";

export default function OfferManagement() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    offerName: "",
    discountValue: "",
    roomTypeId: "",
    startDate: "",
    endDate: "",
    maxUsage: "",
    minStayNights: "",
    minBookingAmount: "",
    description: ""
  });
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    loadOffers();
    loadRoomTypes();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await roomsService.getRoomOffers();
      setOffers(data);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const loadRoomTypes = async () => {
    try {
      const data = await roomsService.getAllRooms();
      setRoomTypes(data);
    } catch (error) {
      console.error("Error loading room types:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        roomTypeId: formData.roomTypeId ? parseInt(formData.roomTypeId) : null,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
        minStayNights: formData.minStayNights ? parseInt(formData.minStayNights) : null,
        minBookingAmount: formData.minBookingAmount ? parseFloat(formData.minBookingAmount) : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      await roomsService.addRoomOffer(submitData);
      toast.success("Offer added successfully");
      setShowForm(false);
      setFormData({
        offerName: "",
        discountValue: "",
        roomTypeId: "",
        startDate: "",
        endDate: "",
        maxUsage: "",
        minStayNights: "",
        minBookingAmount: "",
        description: ""
      });
      loadOffers();
    } catch (error) {
      console.error("Error adding offer:", error);
      toast.error("Failed to add offer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      setLoading(true);
      await roomsService.deleteRoomOffer(offerId);
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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Room Offers Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "Add New Offer"}
        </button>
      </div>

      {showForm && (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Offer Name *</label>
                <input
                  type="text"
                  name="offerName"
                  value={formData.offerName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Percentage *</label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Room Type (Optional)</label>
                <select
                  name="roomTypeId"
                  value={formData.roomTypeId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Room Types</option>
                  {roomTypes.map(roomType => (
                    <option key={roomType.roomTypeID} value={roomType.roomTypeID}>
                      {roomType.roomTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Usage (Optional)</label>
                <input
                  type="number"
                  name="maxUsage"
                  value={formData.maxUsage}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Min Stay Nights (Optional)</label>
                <input
                  type="number"
                  name="minStayNights"
                  value={formData.minStayNights}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Min Booking Amount (Optional)</label>
                <input
                  type="number"
                  name="minBookingAmount"
                  value={formData.minBookingAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Offer"}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      <GlassCard>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Current Offers</h3>

          {loading && offers.length === 0 ? (
            <div className="text-center py-8">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No offers found</div>
          ) : (
            <div className="space-y-3">
              {offers.map(offer => (
                <div key={offer.roomOfferId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{offer.offerName}</h4>
                      <p className="text-sm text-gray-600">{offer.discountValue}% discount</p>
                      {offer.roomTypeName && (
                        <p className="text-sm text-blue-600">Room Type: {offer.roomTypeName}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                      </p>
                      {offer.description && (
                        <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(offer.roomOfferId)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}