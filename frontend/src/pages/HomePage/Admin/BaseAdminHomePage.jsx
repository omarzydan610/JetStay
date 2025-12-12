import { useState } from "react";
import { motion } from "framer-motion";
import { Users, BarChart3 } from "lucide-react";
import UserManagementPage from "./UserManagementPage";
import AdminStatisticsPage from "./AdminStatisticsPage";

export default function BaseAdminHomePage() {
  const [activeMainTab, setActiveMainTab] = useState("statistics");

  const mainTabs = [
    { id: "statistics", label: "System Statistics", icon: BarChart3 },
    { id: "management", label: "Users Management", icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -right-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col w-full px-4 md:px-8 py-8 md:py-16 relative z-10 space-y-6"
      >
        {/* Header and Main Navigation Tabs */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              System Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg md:text-xl">
              Manage users, hotels, and airlines across the platform
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-sky-100 p-2 overflow-x-auto w-full">
            <div className="flex gap-4">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMainTab(tab.id)}
                    className={`py-3 px-4 font-semibold transition-all flex items-center gap-2 whitespace-nowrap rounded-lg ${
                      activeMainTab === tab.id
                        ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-sky-50"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          {activeMainTab === "statistics" && <AdminStatisticsPage />}
          {activeMainTab === "management" && <UserManagementPage />}
        </motion.div>
      </motion.div>
    </div>
  );
}
