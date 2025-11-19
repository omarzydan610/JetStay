import React, { useState } from 'react';
import AirlineForm from '../components/airline-partnership-request-form/AirlineForm';
import HotelForm from '../components/hotel-partnership-request-form/HotelForm';

const PartnershipRequestPage = () => {
  const [partnerType, setPartnerType] = useState('airline');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partnership Request</h1>
          <p className="text-gray-600 mt-2">Choose your business type and register for partnership</p>
        </div>

        {/* Partner Type Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">I want to register as:</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="partnerType"
                value="airline"
                checked={partnerType === 'airline'}
                onChange={(e) => setPartnerType(e.target.value)}
                className="hidden"
              />
              <div className={`p-4 border-2 rounded-lg transition-all ${
                partnerType === 'airline'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="font-medium text-gray-800">Airline Partner</div>
                <div className="text-sm text-gray-600 mt-1">Manage flights and airline operations</div>
              </div>
            </label>
            
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="partnerType"
                value="hotel"
                checked={partnerType === 'hotel'}
                onChange={(e) => setPartnerType(e.target.value)}
                className="hidden"
              />
              <div className={`p-4 border-2 rounded-lg transition-all ${
                partnerType === 'hotel'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="font-medium text-gray-800">Hotel Partner</div>
                <div className="text-sm text-gray-600 mt-1">Manage hotel bookings and availability</div>
              </div>
            </label>
          </div>
        </div>

        {/* Dynamic Form */}
        <div>
          {partnerType === 'airline' ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Airline Registration</h2>
                <p className="text-gray-600 mt-2">Please provide your airline information</p>
              </div>
              <AirlineForm />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Hotel Registration</h2>
                <p className="text-gray-600 mt-2">Please provide your hotel information</p>
              </div>
              <HotelForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnershipRequestPage;