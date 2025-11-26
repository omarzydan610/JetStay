import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AirlineForm from "../../../components/new/PatnershipRequest/AirlineForm";
import HotelForm from "../../../components/new/PatnershipRequest/HotelForm";
import AuthLayout from "../../../components/new/AuthComponents/AuthLayout";
import Plane from "../../../Icons/Plane";
import HotelIcon from "../../../Icons/HotelIcon";

const PartnerShipRequestPage = () => {
  const [partnerType, setPartnerType] = useState("airline");
  const navigate = useNavigate();

  const formContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      style={{
        perspective: "1200px",
        boxShadow: "0 20px 60px -10px rgba(8, 145, 178, 0.3)",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-4 px-6 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate("/auth?mode=signup")}
            className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Go back to authentication"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent mb-1">
            JetStay
          </h1>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Partnership Request
          </h2>
          <p className="text-gray-600 text-center text-base max-w-md">
            Join the JetStay network and expand your business reach.
          </p>
        </div>

        {/* Partner Type Selection - Tabs */}
        <div className="px-6 pt-2 pb-6">
          <div className="flex justify-center">
            <div className="relative bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {/* Sliding Background */}
              <motion.div
                className="absolute top-1 bottom-1 bg-sky-500 rounded-md shadow-md"
                initial={false}
                animate={{
                  left: partnerType === "airline" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 4px)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 40 }}
              />

              <button
                onClick={() => setPartnerType("airline")}
                className={`relative px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 z-10 ${
                  partnerType === "airline"
                    ? "text-white"
                    : "text-gray-600 hover:text-sky-600"
                }`}
              >
                <Plane
                  className={`w-4 h-4 inline mr-2 ${
                    partnerType === "airline" ? "text-white" : "text-gray-600"
                  }`}
                />{" "}
                Airline Partner
              </button>
              <button
                onClick={() => setPartnerType("hotel")}
                className={`relative px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 z-10 ${
                  partnerType === "hotel"
                    ? "text-white"
                    : "text-gray-600 hover:text-sky-600"
                }`}
              >
                <HotelIcon
                  className={`w-4 h-4 inline mr-2 ${
                    partnerType === "hotel" ? "text-white" : "text-gray-600"
                  }`}
                />{" "}
                Hotel Partner
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Form */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            {partnerType === "airline" ? (
              <motion.div
                key="airline"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="rounded-2xl border border-sky-100 bg-sky-50/30 p-6"
              >
                <AirlineForm />
              </motion.div>
            ) : (
              <motion.div
                key="hotel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="rounded-2xl border border-cyan-100 bg-cyan-50/30 p-6"
              >
                <HotelForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      formContent={formContent}
      maxWidth="max-w-2xl"
      showLogoSection={false}
    />
  );
};

export default PartnerShipRequestPage;
