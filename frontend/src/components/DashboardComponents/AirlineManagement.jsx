import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from "react-toastify";
import { getAirlinesByFilter } from '../../services/SystemAdminService/dashboardService';


const AirlineManagement = () => {         // Fix Pagination && Fix Nationality HardCoded  && Add toggleAirlineStatus functionalty

    const [airlines, setAirlines] = useState([]);
    const [airlineSearch, setAirlineSearch] = useState('');
    const [airlineNationalityFilter, setAirlineNationalityFilter] = useState('');
    const [airlineStatusFilter, setAirlineStatusFilter] = useState('');

    const [airlinePage, setAirlinePage] = useState(0); 
    const [airlineRowsPerPage, setAirlineRowsPerPage] = useState(5);

    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchAirlines = async () => {
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
    };

    useEffect(() => {
        fetchAirlines();
    }, [airlinePage, airlineRowsPerPage, airlineSearch, airlineNationalityFilter, airlineStatusFilter]);


    const resetAirlineFilters = () => {
        setAirlineSearch('');
        setAirlineNationalityFilter('');
        setAirlineStatusFilter('');
        setAirlinePage(0);
        fetchAirlines();
    };


    const toggleAirlineStatus = (id) => {
        toast.warn("API for toggle airline status not implemented yet!");
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

                    <select
                        value={airlineNationalityFilter}
                        onChange={(e) => setAirlineNationalityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Nationalites</option>
                        <option value="Qatar">Qatar</option>
                        <option value="USA">USA</option>
                    </select>

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
                            <tr key={airline.id} className="hover:bg-gray-50">
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
                                        onClick={() => toggleAirlineStatus(airline.id)}
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
        </div>
    );
};

export default AirlineManagement;
