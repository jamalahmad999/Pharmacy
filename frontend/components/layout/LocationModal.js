'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';

const countries = [
  { name: 'UAE', flag: '🇦🇪', code: 'AE', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'] },
  { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar'] },
  { name: 'Kuwait', flag: '🇰🇼', code: 'KW', cities: ['Kuwait City', 'Hawalli', 'Salmiya', 'Ahmadi'] },
  { name: 'Qatar', flag: '🇶🇦', code: 'QA', cities: ['Doha', 'Al Rayyan', 'Umm Salal', 'Al Wakrah'] },
  { name: 'Bahrain', flag: '🇧🇭', code: 'BH', cities: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town'] },
  { name: 'Oman', flag: '🇴🇲', code: 'OM', cities: ['Muscat', 'Salalah', 'Nizwa', 'Sur'] },
  { name: 'Egypt', flag: '🇪🇬', code: 'EG', cities: ['Cairo', 'Alexandria', 'Giza', 'Luxor'] },
  { name: 'Jordan', flag: '🇯🇴', code: 'JO', cities: ['Amman', 'Zarqa', 'Irbid', 'Aqaba'] },
];

export default function LocationModal({ isOpen, onClose, onLocationChange, selectedCountry }) {
  const [selectedCountryTemp, setSelectedCountryTemp] = useState(selectedCountry);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setSelectedCountryTemp(country);
    setSelectedCity('');
  };

  const handleSave = () => {
    onLocationChange(selectedCountryTemp);
    onClose();
  };

  const handleClose = () => {
    setSelectedCountryTemp(selectedCountry);
    setSelectedCity('');
    setSearchTerm('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Select Your Location" size="md">
      <div className="space-y-6">
        
        {/* Search */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Countries List */}
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountrySelect(country)}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                selectedCountryTemp.code === country.code ? 'bg-blue-50 border-r-4 border-blue-500' : ''
              }`}
            >
              <span className="text-2xl">{country.flag}</span>
              <span className="text-left font-medium text-gray-900">{country.name}</span>
              {selectedCountryTemp.code === country.code && (
                <div className="ml-auto">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Cities (if country is selected) */}
        {selectedCountryTemp && selectedCountryTemp.cities && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Select City (Optional)</h4>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {selectedCountryTemp.cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    selectedCity === city
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Selection Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{selectedCountryTemp.flag}</span>
              <span className="font-medium text-gray-900">{selectedCountryTemp.name}</span>
            </div>
            {selectedCity && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{selectedCity}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Location
          </button>
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="text-blue-800 font-medium">Delivery Information</p>
              <p className="text-blue-700 mt-1">
                We deliver to {selectedCountryTemp.name} {selectedCity ? `(${selectedCity})` : ''} 
                within 24-48 hours. Free delivery on orders above $50.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
