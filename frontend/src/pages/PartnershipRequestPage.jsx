import React, { useState } from 'react';
import AirlineForm from '../components/airline-partnership-request-form/AirlineForm';
import HotelForm from '../components/hotel-partnership-request-form/HotelForm';

const PartnershipRequestPage = () => {
  const [partnerType, setPartnerType] = useState('airline');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Enhanced Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
          
               <img 
              src="/images/logo.jpg" 
              alt="JetStay" 
              className="w-16 h-16 mr-4 rounded-xl shadow-lg"
            />
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JetStay
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Request</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join the JetStay network and expand your business reach. Choose your business type and register for partnership.
          </p>
        </div>

        {/* Partner Type Selection - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">I want to register as:</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex-1 cursor-pointer group">
              <input
                type="radio"
                name="partnerType"
                value="airline"
                checked={partnerType === 'airline'}
                onChange={(e) => setPartnerType(e.target.value)}
                className="hidden"
              />
              <div className={`p-6 border-2 rounded-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg ${
                partnerType === 'airline'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    partnerType === 'airline' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    <span className="text-white text-xl">✈️</span>
                  </div>
                </div>
                <div className="font-semibold text-gray-800 text-center text-lg">Airline Partner</div>
                <div className="text-sm text-gray-600 mt-2 text-center">Manage flights and airline operations</div>
              </div>
            </label>
            
            <label className="flex-1 cursor-pointer group">
              <input
                type="radio"
                name="partnerType"
                value="hotel"
                checked={partnerType === 'hotel'}
                onChange={(e) => setPartnerType(e.target.value)}
                className="hidden"
              />
              <div className={`p-6 border-2 rounded-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg ${
                partnerType === 'hotel'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md'
                  : 'border-gray-200 hover:border-green-300 bg-white'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    partnerType === 'hotel' ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    <span className="text-white text-xl">🏨</span>
                  </div>
                </div>
                <div className="font-semibold text-gray-800 text-center text-lg">Hotel Partner</div>
                <div className="text-sm text-gray-600 mt-2 text-center">Manage hotel bookings and availability</div>
              </div>
            </label>
          </div>
        </div>

        {/* Dynamic Form */}
        <div className="transform transition-all duration-500">
          {partnerType === 'airline' ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">✈️</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Airline Registration</h2>
                <p className="text-gray-600 mt-3 text-lg">Join JetStay as an airline partner and reach millions of travelers</p>
              </div>
              <AirlineForm />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🏨</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Hotel Registration</h2>
                <p className="text-gray-600 mt-3 text-lg">Partner with JetStay and showcase your hotel to travelers worldwide</p>
              </div>
              <HotelForm />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            © {new Date().getFullYear()} JetStay. All rights reserved.
            <span className="text-blue-600 font-medium ml-2">Partner with confidence.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnershipRequestPage;