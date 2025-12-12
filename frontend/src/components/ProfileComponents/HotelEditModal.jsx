import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building, Upload, Save } from "lucide-react";
import LocationPicker from "../LocationPicker";

function HotelEditModal({ isOpen, onClose, businessData, onSave, error }) {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    logoFile: null,
    logoUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [fileError, setFileError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (businessData && isOpen) {
      setFormData({
        name: businessData.name || "",
        city: businessData.city || "",
        country: businessData.country || "",
        latitude: businessData.latitude || "",
        longitude: businessData.longitude || "",
        logoFile: null,
        logoUrl: businessData.logoUrl || "",
      });
      setLogoPreview(businessData.logoUrl || "");
      setFileError(null);
      setLocationError(null);
    }
  }, [businessData, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setFileError("Please select an image file");
        return;
      }

      setFileError(null);
      setFormData((prev) => ({
        ...prev,
        logoFile: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // Pass the actual form data with the file object
      await onSave({
        name: formData.name,
        city: formData.city,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude,
        logoFile: formData.logoFile, // Pass the actual File object
      });
      onClose();
    } catch (error) {
      console.error("Error saving hotel data:", error);
      // Error will be handled by parent component
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Hotel Information
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            {fileError && (
              <div className="px-6 py-3 bg-red-50 border-l-4 border-red-400">
                <p className="text-sm text-red-700">{fileError}</p>
              </div>
            )}

            {/* Location Error Message */}
            {locationError && (
              <div className="px-6 py-3 bg-red-50 border-l-4 border-red-400">
                <p className="text-sm text-red-700">{locationError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Hotel Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter hotel name"
                  required
                  maxLength={150}
                />
              </div>

              {/* Country and City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Enter country"
                    required
                    maxLength={150}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Enter city"
                    required
                    maxLength={150}
                  />
                </div>
              </div>

              {/* Location Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location & Coordinates
                </label>
                <LocationPicker
                  initialLatitude={formData.latitude || 40.7128}
                  initialLongitude={formData.longitude || -74.006}
                  onLocationChange={({ latitude, longitude }) => {
                    setFormData((prev) => ({
                      ...prev,
                      latitude,
                      longitude,
                    }));
                  }}
                  height="300px"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Logo
                </label>
                <div className="space-y-4">
                  {/* File Upload */}
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">Max 5MB</span>
                  </div>

                  {/* Preview */}
                  {logoPreview && (
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Logo Preview
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.logoFile
                            ? formData.logoFile.name
                            : "Current logo"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center space-x-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HotelEditModal;
