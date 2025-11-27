import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, clearData } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearData();
    localStorage.removeItem("auth_token");
    navigate("/auth");
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              JetStay
            </h1>
          </motion.div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-slate-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 font-medium">
                {userData?.firstName} {userData?.lastName}
              </span>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50"
                >
                  <motion.button
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-slate-50 transition-colors duration-150"
                    whileHover={{ x: 4 }}
                  >
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Profile</span>
                  </motion.button>


                  <div className="border-t border-slate-200 my-1"></div>

                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                    whileHover={{ x: 4 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
