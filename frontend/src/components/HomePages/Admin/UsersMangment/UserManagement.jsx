import React, { useEffect, useState, useCallback } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { toast } from "react-toastify";
import { getUsersByFilter } from '../../../../services/SystemAdminService/dashboardService';
import { activateUser, deactivateUser } from '../../../../services/SystemAdminService/changeStatusService';

const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('');
    const [userStatusFilter, setUserStatusFilter] = useState('');

    const [userPage, setUserPage] = useState(0);
    const [userRowsPerPage] = useState(5);

    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'activate' or 'deactivate'
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const data = {
                search: userSearch || null,
                role: userRoleFilter || null,
                status: userStatusFilter || null,
                page: userPage,
                size: userRowsPerPage
            }

            const response = await getUsersByFilter(data);

            const res = response.data;
            setUsers(res.content);
            setTotalPages(res.totalPages);
            setTotalElements(res.totalElements);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, [userSearch, userRoleFilter, userStatusFilter, userPage, userRowsPerPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const activateUserStatus = async (email) => {
        try {
            const response = await activateUser(email);
            toast.success("User activated successfully");
            console.log("User status toggled:", response.data.message);
        } catch (error) {
            console.error("Error toggling user status:", error)
        }
        fetchUsers();
    };

    const deactivateUserStatus = async (email, reason) => {
        try {
            const response = await deactivateUser(email, reason);
            toast.success("User deactivated successfully");
            console.log("User status toggled:", response.data.message);
            
        } catch (error) {
            console.error("Error toggling user status:", error);
        }
        fetchUsers();
    };

    const openModal = (action, email) => {
        setModalAction(action);
        setSelectedUserEmail(email);
        setDeactivationReason('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalAction(null);
        setSelectedUserEmail(null);
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
                await activateUserStatus(selectedUserEmail);
            } else if (modalAction === 'deactivate') {
                await deactivateUserStatus(selectedUserEmail, deactivationReason);
            }
            closeModal();
        } finally {
            setIsSubmitting(false);
        }
    };


    const resetUserFilters = () => {
        setUserSearch('');
        setUserRoleFilter('');
        setUserStatusFilter('');
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Roles</option>
                        <option value="AIRLINE_ADMIN">AIRLINE_ADMIN</option>
                        <option value="HOTEL_ADMIN">HOTEL_ADMIN</option>
                        <option value="CLIENT">CLIENT</option>
                    </select>

                    <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DEACTIVATED">DEACTIVATED</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            onClick={resetUserFilters}
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
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">First Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.firstName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.lastName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.phoneNumber}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => openModal(user.status === 'ACTIVE' ? 'deactivate' : 'activate', user.email)}
                                        className={`px-4 py-2 rounded-lg text-white transition-colors ${user.status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Showing {userPage * userRowsPerPage + 1} to {Math.min((userPage + 1) * userRowsPerPage, totalElements)} of {totalElements} users
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setUserPage(Math.max(0, userPage - 1))}
                                disabled={userPage === 0}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setUserPage(Math.min(totalPages - 1, userPage + 1))}
                                disabled={userPage === totalPages - 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                {modalAction === 'activate' ? 'Activate User' : 'Deactivate User'}
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
                                    ? 'Are you sure you want to activate this user?'
                                    : 'Are you sure you want to deactivate this user?'}
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
                                        placeholder="Please provide a reason for deactivating this user"
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
                                className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    modalAction === 'activate'
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
        </div>
    );
};

export default UserManagement;
