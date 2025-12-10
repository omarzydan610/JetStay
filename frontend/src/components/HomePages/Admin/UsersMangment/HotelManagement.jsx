import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw, X } from "lucide-react";
import { toast } from "react-toastify";
import { getHotelsByFilter } from "../../../../services/SystemAdminService/dashboardService";
import {
  activateHotel,
  deactivateHotel,
} from "../../../../services/SystemAdminService/changeStatusService";

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);

  const [hotelSearch, setHotelSearch] = useState("");
  const [hotelStatusFilter, setHotelStatusFilter] = useState("");
  const [hotelCountryFilter, setHotelCountryFilter] = useState("");
  const [hotelCityFilter, setHotelCityFilter] = useState("");

  const [hotelPage, setHotelPage] = useState(0);
  const [hotelRowsPerPage] = useState(10);

  const [totalHotels, setTotalHotels] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'activate' or 'deactivate'
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHotels = useCallback(async () => {
    try {
      const body = {
        search: hotelSearch,
        country: hotelCountryFilter || null,
        city: hotelCityFilter || null,
        status: hotelStatusFilter || null,
        page: hotelPage,
        size: hotelRowsPerPage,
      };

      const response = await getHotelsByFilter(body);
      const data = response.data;

      setHotels(data.content || []);
      setTotalHotels(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  }, [
    hotelSearch,
    hotelStatusFilter,
    hotelCountryFilter,
    hotelCityFilter,
    hotelPage,
    hotelRowsPerPage,
  ]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const activateHotelStatus = async (hotelId) => {
    try {
      await activateHotel(hotelId);
      toast.success("Hotel activated successfully");
      fetchHotels();
    } catch (error) {
      console.error("Error activating hotel:", error);
      toast.error("Failed to activate hotel");
    }
  };

  const deactivateHotelStatus = async (hotelId, reason) => {
    try {
      await deactivateHotel(hotelId, reason);
      toast.success("Hotel deactivated successfully");
      fetchHotels();
    } catch (error) {
      console.error("Error deactivating hotel:", error);
      toast.error("Failed to deactivate hotel");
    }
  };

  const openModal = (action, hotelId) => {
    setModalAction(action);
    setSelectedHotelId(hotelId);
    setDeactivationReason("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedHotelId(null);
    setDeactivationReason("");
  };

  const handleConfirm = async () => {
    if (modalAction === "deactivate" && !deactivationReason.trim()) {
      toast.error("Please provide a reason for deactivation");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalAction === "activate") {
        await activateHotelStatus(selectedHotelId);
      } else if (modalAction === "deactivate") {
        await deactivateHotelStatus(selectedHotelId, deactivationReason);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Filters
  const resetHotelFilters = () => {
    setHotelSearch("");
    setHotelStatusFilter("");
    setHotelCountryFilter("");
    setHotelCityFilter("");
    setHotelPage(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Hotel Management
        </h2>
        <p className="text-gray-600">
          Manage and monitor all registered hotels
        </p>
      </div>

      {/* Filter Box */}
      <div className="bg-white rounded-xl shadow-md border border-sky-100 p-4 md:p-6 mb-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Search hotels"
            value={hotelSearch}
            onChange={(e) => setHotelSearch(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          />

          <select
            value={hotelStatusFilter}
            onChange={(e) => setHotelStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <input
            type="text"
            placeholder="Filter by City"
            value={hotelCityFilter}
            onChange={(e) => setHotelCityFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          />

          <input
            type="text"
            placeholder="Filter by Country"
            value={hotelCountryFilter}
            onChange={(e) => setHotelCountryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          />

          <div />

          <button
            onClick={resetHotelFilters}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-gray-700"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-sky-100 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-gray-200">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                  City
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                  Country
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="hover:bg-sky-50/50 transition-colors duration-150"
                  >
                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                      {hotel.id}
                    </td>

                    <td className="px-4 md:px-6 py-4">
                      <img
                        src={hotel.logoURL}
                        alt={hotel.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                      />
                    </td>

                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                      {hotel.name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {hotel.city}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {hotel.country}
                    </td>

                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                      ⭐ {hotel.rate?.toFixed(1)}
                    </td>

                    <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotel.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {hotel.status}
                      </span>
                    </td>

                    <td className="px-4 md:px-6 py-4 text-sm">
                      <button
                        onClick={() =>
                          openModal(
                            hotel.status === "ACTIVE"
                              ? "deactivate"
                              : "activate",
                            hotel.id
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all duration-200 ${
                          hotel.status === "ACTIVE"
                            ? "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                            : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {hotel.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 md:px-6 py-12 text-center text-gray-500"
                  >
                    <p className="text-lg">No hotels found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-600">
              Showing {hotels.length > 0 ? hotelPage * hotelRowsPerPage + 1 : 0}{" "}
              to {Math.min((hotelPage + 1) * hotelRowsPerPage, totalHotels)} of{" "}
              {totalHotels} hotels
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setHotelPage(Math.max(0, hotelPage - 1))}
                disabled={hotelPage === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                Previous
              </button>
              <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                Page {hotelPage + 1} of {totalPages}
              </div>
              <button
                onClick={() =>
                  setHotelPage(Math.min(totalPages - 1, hotelPage + 1))
                }
                disabled={hotelPage >= totalPages - 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-cyan-50">
              <h3 className="text-lg font-bold text-gray-900">
                {modalAction === "activate"
                  ? "Activate Hotel"
                  : "Deactivate Hotel"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {modalAction === "activate"
                  ? "Are you sure you want to activate this hotel?"
                  : "Are you sure you want to deactivate this hotel?"}
              </p>

              {/* Deactivation Reason Input */}
              {modalAction === "deactivate" && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Deactivation *
                  </label>
                  <textarea
                    value={deactivationReason}
                    onChange={(e) => setDeactivationReason(e.target.value)}
                    placeholder="Please provide a reason..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                  {!deactivationReason.trim() && (
                    <p className="text-red-500 text-xs mt-2 font-medium">
                      Reason is required
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={
                  isSubmitting ||
                  (modalAction === "deactivate" && !deactivationReason.trim())
                }
                className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  modalAction === "activate"
                    ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                    : "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isSubmitting
                  ? "Processing..."
                  : modalAction === "activate"
                  ? "Activate"
                  : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
