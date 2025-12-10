import React, { useEffect, useState, useCallback } from "react";
import { RotateCcw, X, Star, Users, Hotel, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAppContext } from "../../../contexts/AppContext";
import { getUsersByFilter } from "../../../services/SystemAdminService/dashboardService";
import {
  activateUser,
  deactivateUser,
} from "../../../services/SystemAdminService/changeStatusService";
import HotelManagement from "../../../components/HomePages/Admin/UsersMangment/HotelManagement";
import AirlineManagement from "../../../components/HomePages/Admin/UsersMangment/AirlineManagement";

export default function AdminUserManagementPage() {
  const { userData: currentUser } = useAppContext();
  const [activeSubTab, setActiveSubTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("");

  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'activate' or 'deactivate'
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subTabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "airlines", label: "Airlines", icon: Plane },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      const data = {
        search: userSearch || null,
        role: userRoleFilter || null,
        status: userStatusFilter || null,
        page: userPage,
        size: userRowsPerPage,
      };

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
      console.error("Error toggling user status:", error);
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

  const openModal = (action, email, firstName, lastName) => {
    setModalAction(action);
    setSelectedUserEmail(email);
    setDeactivationReason("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedUserEmail(null);
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
        await activateUserStatus(selectedUserEmail);
      } else if (modalAction === "deactivate") {
        await deactivateUserStatus(selectedUserEmail, deactivationReason);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetUserFilters = () => {
    setUserSearch("");
    setUserRoleFilter("");
    setUserStatusFilter("");
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Users Management
        </h2>
        <p className="text-gray-600">
          Manage users, hotels, and airlines across the platform
        </p>
      </div>

      {/* Sub Navigation Tabs - Full Width */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-sky-50 p-2 mb-6">
        <div className="flex gap-3 flex-wrap">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-2 px-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap rounded-lg text-sm ${
                  activeSubTab === tab.id
                    ? "bg-sky-100 text-sky-700 border border-sky-300"
                    : "text-gray-600 hover:bg-sky-50"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeSubTab === "users" && (
        <div>
          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-md border border-sky-100 p-4 md:p-6 mb-6 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Search by name or email"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              >
                <option value="">All Roles</option>
                <option value="AIRLINE_ADMIN">Airline Admin</option>
                <option value="HOTEL_ADMIN">Hotel Admin</option>
                <option value="CLIENT">Client</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DEACTIVATED">Deactivated</option>
              </select>

              <div />

              <button
                onClick={resetUserFilters}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-gray-700"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-md border border-sky-100 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Role
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
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-sky-50/50 transition-colors duration-150"
                      >
                        <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                          {user.email}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                          {user.phoneNumber}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                            {user.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            {currentUser?.email === user.email ? (
                              <div
                                className="flex items-center gap-1 text-yellow-600"
                                title="Current Admin"
                              >
                                <Star size={18} fill="currentColor" />
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  openModal(
                                    user.status === "ACTIVE"
                                      ? "deactivate"
                                      : "activate",
                                    user.email,
                                    user.firstName,
                                    user.lastName
                                  )
                                }
                                className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all duration-200 ${
                                  user.status === "ACTIVE"
                                    ? "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                                    : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                                }`}
                              >
                                {user.status === "ACTIVE"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 md:px-6 py-12 text-center text-gray-500"
                      >
                        <p className="text-lg">No users found</p>
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
                  Showing {userPage * userRowsPerPage + 1} to{" "}
                  {Math.min((userPage + 1) * userRowsPerPage, totalElements)} of{" "}
                  {totalElements} users
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserPage(Math.max(0, userPage - 1))}
                    disabled={userPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                    Page {userPage + 1} of {totalPages}
                  </div>
                  <button
                    onClick={() =>
                      setUserPage(Math.min(totalPages - 1, userPage + 1))
                    }
                    disabled={userPage === totalPages - 1}
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
                      ? "Activate User"
                      : "Deactivate User"}
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
                      ? `Are you sure you want to activate this user?`
                      : `Are you sure you want to deactivate this user?`}
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
                      (modalAction === "deactivate" &&
                        !deactivationReason.trim())
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
      )}
      {activeSubTab === "hotels" && <HotelManagement />}
      {activeSubTab === "airlines" && <AirlineManagement />}
    </div>
  );
}
