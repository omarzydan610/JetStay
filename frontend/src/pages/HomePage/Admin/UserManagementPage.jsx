import React, { useState } from "react";
import { Users, Hotel, Plane, BookOpen} from "lucide-react";
import HotelManagement from "../../../components/HomePages/Admin/UsersMangment/HotelManagement";
import AirlineManagement from "../../../components/HomePages/Admin/UsersMangment/AirlineManagement";
import UserManagement from "../../../components/HomePages/Admin/UsersMangment/UserManagement";
import FlaggedReviewsManager from "../../../components/HomePages/Admin/UsersMangment/ReviewsManagement";

export default function AdminUserManagementPage() {

  const [activeSubTab, setActiveSubTab] = useState("users");


  const subTabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "airlines", label: "Airlines", icon: Plane },
    {id: "reviews", label: "Reviews", icon: BookOpen},
  ];

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
      {activeSubTab === "users" && <UserManagement />}
      {activeSubTab === "hotels" && <HotelManagement />}
      {activeSubTab === "airlines" && <AirlineManagement />}
      {activeSubTab === "reviews" && <FlaggedReviewsManager />}
    </div>
  );
}
