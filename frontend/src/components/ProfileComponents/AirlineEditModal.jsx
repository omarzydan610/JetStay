import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plane, Upload, Save } from "lucide-react";

function AirlineEditModal({ isOpen, onClose, businessData, onSave, error }) {
  const [formData, setFormData] = useState({
    name: "",
    nationality: "",
    logoFile: null,
    logoUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    if (businessData && isOpen) {
      setFormData({
        name: businessData.name || "",
        nationality: businessData.nationality || "",
        logoFile: null,
        logoUrl: businessData.logoUrl || "",
      });
      setLogoPreview(businessData.logoUrl || "");
      setFileError(null);
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
      // For now, we'll just pass the form data
      // In a real implementation, you'd upload the file and get a URL
      const submitData = {
        ...formData,
        logoUrl: formData.logoFile ? logoPreview : formData.logoUrl,
      };
      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving airline data:", error);
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
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Plane className="w-6 h-6 text-sky-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Airline Information
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Airline Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airline Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter airline name"
                  required
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter nationality"
                  required
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airline Logo
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

export default AirlineEditModal;
