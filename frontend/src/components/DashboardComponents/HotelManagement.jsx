import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { getHotelsByFilter } from "../../services/SystemAdminService/dashboardService";

const HotelManagement = () => {    // Fix pagination && Add togglHotelStatus functionalty

    const [hotels, setHotels] = useState([]);

    const [hotelSearch, setHotelSearch] = useState("");
    const [hotelStatusFilter, setHotelStatusFilter] = useState("");
    const [hotelCountryFilter, setHotelCountryFilter] = useState("");
    const [hotelCityFilter, setHotelCityFilter] = useState("");


    const [hotelPage, setHotelPage] = useState(0);
    const [hotelRowsPerPage] = useState(10);

    const [totalHotels, setTotalHotels] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    const fetchHotels = async () => {
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
    };

    useEffect(() => {
        fetchHotels();
    }, [hotelPage, hotelSearch, hotelStatusFilter, hotelCountryFilter, hotelCityFilter]);

    // Toggle status (UI Only)
    const toggleHotelStatus = (id) => {
        setHotels(
            hotels.map((hotel) =>
                hotel.id === id
                    ? { ...hotel, status: hotel.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
                    : hotel
            )
        );
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
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Hotel Management</h2>

            {/* Filter Box */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={hotelSearch}
                        onChange={(e) => setHotelSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <select
                        value={hotelStatusFilter}
                        onChange={(e) => setHotelStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by City"
                        value={hotelCityFilter}
                        onChange={(e) => setHotelCityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="text"
                        placeholder="Filter by Country"
                        value={hotelCountryFilter}
                        onChange={(e) => setHotelCountryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />


                    <div className="flex gap-2">
                        <button
                            onClick={resetHotelFilters}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">City</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {hotels.map((hotel) => (
                            <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900">{hotel.id}</td>

                                <td className="px-6 py-4">
                                    <img
                                        src={hotel.logoURL}
                                        alt="logo"
                                        className="w-10 h-10 rounded object-cover border"
                                    />
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-900">{hotel.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{hotel.city}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{hotel.country}</td>

                                <td className="px-6 py-4 text-sm text-gray-900">⭐ {hotel.rate}</td>

                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${hotel.status === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {hotel.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => toggleHotelStatus(hotel.id)}
                                        className={`px-4 py-2 rounded-lg text-white transition-colors ${hotel.status === "ACTIVE"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        {hotel.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Showing {hotels.length > 0 ? hotelPage * hotelRowsPerPage + 1 : 0} to{" "}
                            {Math.min((hotelPage + 1) * hotelRowsPerPage, totalHotels)} of {totalHotels} hotels
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setHotelPage(Math.max(0, hotelPage - 1))}
                                disabled={hotelPage === 0}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setHotelPage(Math.min(totalPages - 1, hotelPage + 1))}
                                disabled={hotelPage >= totalPages - 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelManagement;
