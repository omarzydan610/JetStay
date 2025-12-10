import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Star,
  Users,
  MapPin,
  Hotel,
  Edit2,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

function HotelBusinessInfoSection({
  businessData,
  onEdit,
  isEditing = false,
  hotelImages = [],
  onAddImage,
  onDeleteImage,
}) {
  const [logoError, setLogoError] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogoError = () => {
    setLogoError(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onAddImage) {
      onAddImage(file);
    }
    // Reset input so the same file can be selected again if needed
    event.target.value = "";
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Hotel Information
          </h2>
        </div>
        {!isEditing && (
          <motion.button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Side - Big Logo Circle */}
        <div className="flex justify-center lg:justify-start">
          <motion.div
            className="w-64 h-64 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-full flex items-center justify-center border-4 border-sky-200"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {businessData?.logoUrl && !logoError ? (
              <img
                src={businessData.logoUrl}
                alt="Hotel Logo"
                className="w-60 h-60 rounded-full object-cover"
                onError={handleLogoError}
              />
            ) : (
              <Hotel className="w-16 h-16 text-sky-600" />
            )}
          </motion.div>
        </div>

        {/* Right Side - Name, Location, Rate and Reviews */}
        <div className="space-y-6">
          {/* Hotel Name and Location */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {businessData?.name || "Hotel Name"}
            </h3>
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              <span className="text-lg text-gray-600 font-medium">
                {businessData?.city && businessData?.country
                  ? `${businessData.city}, ${businessData.country}`
                  : businessData?.city || businessData?.country || "Location"}
              </span>
            </div>
          </motion.div>

          {/* Rate and Reviews Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              className="bg-gradient-to-r from-sky-50 to-cyan-50 p-6 rounded-xl border border-sky-200"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold text-gray-800">
                  Rating
                </span>
              </div>
              <div className="text-3xl font-bold text-sky-600">
                {businessData?.rate ? `${businessData.rate}/5` : "N/A"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Based on customer reviews
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-6 h-6 text-emerald-600" />
                <span className="text-lg font-semibold text-gray-800">
                  Reviews
                </span>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {businessData?.numberOfRates || "0"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Total customer reviews
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= New Gallery Section ================= */}
      <div className="border-t border-gray-100 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ImageIcon className="w-6 h-6 text-sky-600" />
            <h3 className="text-xl font-bold text-gray-900">Hotel Gallery</h3>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <motion.button
              onClick={handleUploadClick}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Image</span>
            </motion.button>
          </div>
        </div>

        {/* Scrollable Image Container */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-gray-50">
            {hotelImages && hotelImages.length > 0 ? (
              hotelImages.map((image) => (
                <motion.div
                  key={image.imageID}
                  className="group relative flex-shrink-0 w-64 h-48 rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-50"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={image.imageUrl}
                    alt="Hotel Room"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Delete Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                      onClick={() => onDeleteImage(image.imageID)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete Image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="w-full py-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No images added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default HotelBusinessInfoSection;