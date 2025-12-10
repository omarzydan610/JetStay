import React, { useState } from 'react';
import { Users, Hotel, Plane, Menu, X } from 'lucide-react';
import UserManagement from '../components/DashboardComponents/UserManagement';
import AirlineManagement from '../components/DashboardComponents/AirlineManagement';
import HotelManagement from '../components/DashboardComponents/HotelManagement';

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-indigo-50 h-screen transition-all duration-300 overflow-hidden flex flex-col`}>
      <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-indigo-600 font-bold">J</div>
          <h1 className="text-xl font-bold">JetStay</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <button
          onClick={() => setCurrentPage('users')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users size={20} />
          <span className="font-medium">User Management</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('hotels')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === 'hotels' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Hotel size={20} />
          <span className="font-medium">Hotel Management</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('airlines')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
            currentPage === 'airlines' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Plane size={20} />
          <span className="font-medium">Airline Management</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {currentPage === 'users' && <UserManagement />}
        {currentPage === 'hotels' && <HotelManagement />}
        {currentPage === 'airlines' && <AirlineManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;