import React, { useState, useEffect, useCallback } from "react";
import roomTypeService from "../services/roomTypeService";
import RoomTypeList from "../components/roomType/RoomTypeList";
import RoomTypeModal from "../components/roomType/RoomTypeModal";

const RoomTypePage = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
  }, []);

  const fetchRoomTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await roomTypeService.getAllRoomTypes();
      if (response.success && response.data) {
        setRoomTypes(response.data);
      } else {
        setRoomTypes([]);
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
      showNotification("Failed to load room types", "error");
      setRoomTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Fetch all room types on component mount
  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreate = () => {
    setSelectedRoomType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (roomType) => {
    setSelectedRoomType(roomType);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room type?")) {
      return;
    }

    try {
      const response = await roomTypeService.deleteRoomType(id);
      if (response.success) {
        showNotification("Room type deleted successfully", "success");
        fetchRoomTypes();
      }
    } catch (error) {
      console.error("Error deleting room type:", error);
      showNotification(
        error.response?.data?.message || "Failed to delete room type",
        "error"
      );
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedRoomType) {
        // Update existing room type
        const response = await roomTypeService.updateRoomType(
          selectedRoomType.id,
          formData
        );
        if (response.success) {
          showNotification("Room type updated successfully", "success");
          setIsModalOpen(false);
          fetchRoomTypes();
        }
      } else {
        // Create new room type
        const response = await roomTypeService.addRoomType(formData);
        if (response.success) {
          showNotification("Room type created successfully", "success");
          setIsModalOpen(false);
          fetchRoomTypes();
        }
      }
    } catch (error) {
      console.error("Error saving room type:", error);
      showNotification(
        error.response?.data?.message || "Failed to save room type",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setSelectedRoomType(null);
    }
  };

  // Filter room types based on search term
  const filteredRoomTypes = roomTypes.filter(
    (roomType) =>
      roomType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomType.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalRooms = roomTypes.reduce((sum, rt) => sum + (rt.quantity || 0), 0);
  const avgPrice =
    roomTypes.length > 0
      ? roomTypes.reduce((sum, rt) => sum + (rt.basePrice || 0), 0) /
        roomTypes.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Room Type Management
                </h1>
                <p className="text-gray-600">
                  Configure and manage your hotel room types
                </p>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Room Type
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Room Types
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {roomTypes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Price
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${avgPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 rounded-xl shadow-lg border ${
              notification.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            } transform transition-all duration-300 ease-in-out`}
          >
            <div className="p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  {notification.type === "success" ? (
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      notification.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {notification.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setNotification(null)}
                    className={`inline-flex rounded-md p-1.5 focus:outline-none transition-colors ${
                      notification.type === "success"
                        ? "text-green-500 hover:bg-green-100"
                        : "text-red-500 hover:bg-red-100"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search room types by name or description..."
              maxLength={150}
            />
          </div>
        </div>

        {/* Room Types List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <RoomTypeList
            roomTypes={filteredRoomTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>

        {/* Modal */}
        <RoomTypeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          roomType={selectedRoomType}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default RoomTypePage;
