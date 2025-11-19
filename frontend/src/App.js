import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PartnershipRequestPage from './pages/PartnershipRequestPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Travel Management
              </Link>
              <div className="space-x-4">
                <Link 
                  to="/partnership-request" 
                  className="text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  Partnership Request
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome</h1>
                <p className="text-gray-600 mb-8">Manage your travel partnerships</p>
                <div className="space-x-4">
                  <Link 
                    to="/partnership-request" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                  >
                    New Partnership Request
                  </Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/partnership-request" element={<PartnershipRequestPage />} />
          
          {/* يمكنك الاحتفاظ بالروابط القديمة كـ redirects إذا أردت */}
          <Route path="/add-hotel" element={<PartnershipRequestPage initialType="hotel" />} />
          <Route path="/add-airline" element={<PartnershipRequestPage initialType="airline" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
