import React, { useEffect, useState, useCallback } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { toast } from "react-toastify";
import { getAirlinesByFilter } from "../../../../services/SystemAdminService/dashboardService";
import {
  activateAirline,
  deactivateAirline,
} from "../../../../services/SystemAdminService/changeStatusService";

const AirlineManagement = () => {
  // Need to Fix Nationality HardCoded

  const [airlines, setAirlines] = useState([]);
  const [airlineSearch, setAirlineSearch] = useState("");
  const [airlineNationalityFilter, setAirlineNationalityFilter] = useState("");
  const [airlineStatusFilter, setAirlineStatusFilter] = useState("");

  const [airlinePage, setAirlinePage] = useState(0);
  const [airlineRowsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'activate' or 'deactivate'
  const [selectedAirlineId, setSelectedAirlineId] = useState(null);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAirlines = useCallback(async () => {
    try {
      const body = {
        search: airlineSearch || null,
        nationality: airlineNationalityFilter || null,
        status: airlineStatusFilter || null,
        page: airlinePage,
        size: airlineRowsPerPage,
      };

      const res = await getAirlinesByFilter(body);

      const data = res.data;
      setAirlines(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching airlines:", error);
      toast.error("Failed to fetch airlines");
    }
  }, [
    airlineSearch,
    airlineNationalityFilter,
    airlineStatusFilter,
    airlinePage,
    airlineRowsPerPage,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAirlines();
  }, [fetchAirlines]);

  const resetAirlineFilters = () => {
    setAirlineSearch("");
    setAirlineNationalityFilter("");
    setAirlineStatusFilter("");
    setAirlinePage(0);
    fetchAirlines();
  };

  const activateAirlineStatus = async (airlineId) => {
    try {
      await activateAirline(airlineId);
      toast.success("Airline activated successfully");
      fetchAirlines();
    } catch (error) {
      console.error("Error activating airline:", error);
      toast.error("Failed to activate airline");
    }
  };

  const deactivateAirlineStatus = async (airlineId, reason) => {
    try {
      await deactivateAirline(airlineId, reason);
      toast.success("Airline deactivated successfully");
      fetchAirlines();
    } catch (error) {
      console.error("Error deactivating airline:", error);
      toast.error("Failed to deactivate airline");
    }
  };

  const openModal = (action, airlineId) => {
    setModalAction(action);
    setSelectedAirlineId(airlineId);
    setDeactivationReason("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedAirlineId(null);
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
        await activateAirlineStatus(selectedAirlineId);
      } else if (modalAction === "deactivate") {
        await deactivateAirlineStatus(selectedAirlineId, deactivationReason);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Airline Management
        </h2>
        <p className="text-gray-600">
          Manage and monitor all registered airlines
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-sky-100 p-4 md:p-6 mb-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search by name"
            value={airlineSearch}
            onChange={(e) => setAirlineSearch(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          />

          <select
            value={airlineStatusFilter}
            onChange={(e) => setAirlineStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={airlineNationalityFilter}
            onChange={(e) => setAirlineNationalityFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
          >
            <option value="">All Nationalities</option>
            <option value="Qatar">Qatar</option>
            <option value="USA">USA</option>
            <option value="Egypt">Egypt</option>
            <option value="UAE">UAE</option>
          </select>

          <div />

          <button
            onClick={resetAirlineFilters}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-gray-700"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>

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
                  Nationality
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
              {airlines.length > 0 ? (
                airlines.map((airline) => (
                  <tr
                    key={airline.id}
                    className="hover:bg-sky-50/50 transition-colors duration-150"
                  >
                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                      {airline.id}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <img
                        src={airline.logoURL}
                        alt={airline.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                      {airline.name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {airline.nationality}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                      ⭐ {airline.rate?.toFixed(1)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          airline.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : airline.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {airline.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      {airline.status === "PENDING" ? (
                        <button
                          onClick={() => openModal("activate", airline.id)}
                          className="px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            openModal(
                              airline.status === "ACTIVE"
                                ? "deactivate"
                                : "activate",
                              airline.id
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all duration-200 ${
                            airline.status === "ACTIVE"
                              ? "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                              : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                          }`}
                        >
                          {airline.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 md:px-6 py-12 text-center text-gray-500"
                  >
                    <p className="text-lg">No airlines found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


const AirlineManagement = () => {        

    const [airlines, setAirlines] = useState([]);
    const [airlineSearch, setAirlineSearch] = useState('');
    const [airlineNationalityFilter, setAirlineNationalityFilter] = useState('');
    const [airlineStatusFilter, setAirlineStatusFilter] = useState('');

    const [airlinePage, setAirlinePage] = useState(0);
    const [airlineRowsPerPage] = useState(5);

    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'activate' or 'deactivate'
    const [selectedAirlineId, setSelectedAirlineId] = useState(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Airline admin details modal state
    const [adminDetails, setAdminDetails] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false);
    const [adminError, setAdminError] = useState(null);

    const fetchAirlines = useCallback(async () => {
        try {

            const body = {
                search: airlineSearch || null,
                nationality: airlineNationalityFilter || null,
                status: airlineStatusFilter || null,
                page: airlinePage,
                size: airlineRowsPerPage
            };

            const res = await getAirlinesByFilter(body);

            const data = res.data;
            setAirlines(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

        } catch (error) {
            console.error("Error fetching airlines:", error);
            toast.error("Failed to fetch airlines");
        }
    }, [airlineSearch, airlineNationalityFilter, airlineStatusFilter, airlinePage, airlineRowsPerPage]);


    useEffect(() => {
        fetchAirlines();
    }, [fetchAirlines]);


    const resetAirlineFilters = () => {
        setAirlineSearch('');
        setAirlineNationalityFilter('');
        setAirlineStatusFilter('');
        setAirlinePage(0);
        fetchAirlines();
    };

    const activateAirlineStatus = async (airlineId) => {
        try {
            await activateAirline(airlineId);
            toast.success("Airline activated successfully");
            fetchAirlines();
        } catch (error) {
            console.error("Error activating airline:", error);
            toast.error("Failed to activate airline");
        }
    };

    const deactivateAirlineStatus = async (airlineId, reason) => {
        try {
            await deactivateAirline(airlineId, reason);
            toast.success("Airline deactivated successfully");
            fetchAirlines();
        } catch (error) {
            console.error("Error deactivating airline:", error);
            toast.error("Failed to deactivate airline");
        }
    };

    const handleRowClick = async (airlineId) => {
        setAdminError(null);
        setAdminDetails(null);
        setAdminLoading(true);
        try {
            const res = await getAirlineAdmin(airlineId);
            const admin = res && res.data ? res.data : null;
            setAdminDetails(admin);
            setShowAdminModal(true);
        } catch (error) {
            console.error('Error fetching airline admin details:', error);
            setAdminError('Failed to load admin details');
        } finally {
            setAdminLoading(false);
        }
    };

    const openModal = (action, airlineId) => {
        setModalAction(action);
        setSelectedAirlineId(airlineId);
        setDeactivationReason('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalAction(null);
        setSelectedAirlineId(null);
        setDeactivationReason('');
    };

    const handleConfirm = async () => {
        if (modalAction === 'deactivate' && !deactivationReason.trim()) {
            toast.error("Please provide a reason for deactivation");
            return;
        }

        setIsSubmitting(true);
        try {
            if (modalAction === 'activate') {
                await activateAirlineStatus(selectedAirlineId);
            } else if (modalAction === 'deactivate') {
                await deactivateAirlineStatus(selectedAirlineId, deactivationReason);
            }
            closeModal();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Airline Management</h2>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={airlineSearch}
                        onChange={(e) => setAirlineSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <select
                        value={airlineStatusFilter}
                        onChange={(e) => setAirlineStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Nationality"
                        value={airlineNationalityFilter}
                        onChange={(e) => setAirlineNationalityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={resetAirlineFilters}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nationality</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {airlines.map((airline) => (
                            <tr key={airline.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(airline.id)}>
                                <td className="px-6 py-4 text-sm text-gray-900">{airline.id}</td>
                                <td className="px-6 py-4">
                                    <img src={airline.logoURL} alt={airline.name} className="w-10 h-10 rounded" />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{airline.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{airline.nationality}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">⭐ {airline.rate}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${airline.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {airline.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openModal(airline.status === 'ACTIVE' ? 'deactivate' : 'activate', airline.id); }}
                                        className={`px-4 py-2 rounded-lg text-white transition-colors ${airline.status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        {airline.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Showing {airlinePage * airlineRowsPerPage + 1} to {Math.min((airlinePage + 1) * airlineRowsPerPage, totalElements)} of {totalElements}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setAirlinePage(Math.max(0, airlinePage - 1))}
                                disabled={airlinePage === 0}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setAirlinePage(Math.min(totalPages - 1, airlinePage + 1))}
                                disabled={airlinePage + 1 >= totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {modalAction === 'activate' ? 'Activate Airline' : 'Deactivate Airline'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                {modalAction === 'activate'
                                    ? 'Are you sure you want to activate this airline?'
                                    : 'Are you sure you want to deactivate this airline?'}
                            </p>

                            {/* Deactivation Reason Input */}
                            {modalAction === 'deactivate' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Deactivation *
                                    </label>
                                    <textarea
                                        value={deactivationReason}
                                        onChange={(e) => setDeactivationReason(e.target.value)}
                                        placeholder="Please provide a reason for deactivating this airline"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                        rows="4"
                                    />
                                    {!deactivationReason.trim() && (
                                        <p className="text-red-500 text-xs mt-1">Reason is required</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isSubmitting || (modalAction === 'deactivate' && !deactivationReason.trim())}
                                className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${modalAction === 'activate'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {isSubmitting ? 'Processing...' : (modalAction === 'activate' ? 'Activate' : 'Deactivate')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Airline Admin Details Modal */}
            {showAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Airline Admin Details</h3>
                            <button
                                onClick={() => { setShowAdminModal(false); setAdminDetails(null); }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {adminLoading && (
                                <p className="text-gray-600">Loading admin details...</p>
                            )}

                            {adminError && (
                                <p className="text-red-500">{adminError}</p>
                            )}

                            {!adminLoading && adminDetails && (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Name: </span>
                                        <span className="text-sm text-gray-900">{adminDetails.firstName} {adminDetails.lastName}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Email: </span>
                                        <span className="text-sm text-gray-900">{adminDetails.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Phone: </span>
                                        <span className="text-sm text-gray-900">{adminDetails.phoneNumber}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Role: </span>
                                        <span className="text-sm text-gray-900">{adminDetails.role}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Status: </span>
                                        <span className="text-sm text-gray-900">{adminDetails.status}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => { setShowAdminModal(false); setAdminDetails(null); }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AirlineManagement;