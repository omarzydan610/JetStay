import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Star, Users, Globe, Edit2 } from "lucide-react";

function AirlineBusinessInfoSection({
  businessData,
  onEdit,
  isEditing = false,
}) {
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    setLogoError(true);
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
          <Plane className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Airline Information
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                alt="Airline Logo"
                className="w-60 h-60 rounded-full object-cover"
                onError={handleLogoError}
              />
            ) : (
              <Plane className="w-16 h-16 text-sky-600" />
            )}
          </motion.div>
        </div>

        {/* Right Side - Name, Nationality, Rate and Reviews */}
        <div className="space-y-6">
          {/* Airline Name and Nationality */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {businessData?.name || "Airline Name"}
            </h3>
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <Globe className="w-5 h-5 text-sky-600" />
              <span className="text-lg text-gray-600 font-medium">
                {businessData?.nationality || "Nationality"}
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
    </motion.div>
  );
}

export default AirlineBusinessInfoSection;
