import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Edit2 } from "lucide-react";

function AdminInfoSection({ userData, onEdit, isEditing = false }) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Information
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <Mail className="w-5 h-5 text-sky-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-900">{userData?.email || "N/A"}</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <Phone className="w-5 h-5 text-sky-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-gray-900">{userData?.phoneNumber || "N/A"}</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <User className="w-5 h-5 text-sky-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">First Name</p>
            <p className="text-gray-900">{userData?.firstName || "N/A"}</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <User className="w-5 h-5 text-sky-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Last Name</p>
            <p className="text-gray-900">{userData?.lastName || "N/A"}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AdminInfoSection;
