"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

export default function LocationMapModal({ isOpen, onClose, onSelect }) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState("25.2048,55.2708"); // Dubai coordinates
  const [locationStatus, setLocationStatus] = useState(""); // For user feedback

  const detectMyLocation = () => {
    setIsLoading(true);
    setLocationStatus("Requesting location permission...");
    
    if (!navigator.geolocation) {
      setIsLoading(false);
      setLocationStatus("");
      alert("❌ Location detection is not supported by your browser. Please enter your address manually.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus("Getting your address...");
        const { latitude, longitude } = position.coords;
        const coords = `${latitude},${longitude}`;
        setMapCenter(coords);
        
        try {
          // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'SmartPharmacy/1.0'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const fullAddress = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setAddress(fullAddress);
            setLocationStatus("✅ Location detected successfully!");
            setTimeout(() => setLocationStatus(""), 3000);
          } else {
            // Fallback to coordinates if API fails
            const coordAddress = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
            setAddress(coordAddress);
            setLocationStatus("⚠️ Using coordinates. You can edit the address below.");
            setTimeout(() => setLocationStatus(""), 5000);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          // Fallback to coordinates
          const coordAddress = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
          setAddress(coordAddress);
          setLocationStatus("⚠️ Using coordinates. Please edit to add full address.");
          setTimeout(() => setLocationStatus(""), 5000);
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
        setLocationStatus("");
        
        let errorMessage = "❌ Unable to detect your location.\n\n";
        
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += "🔒 Location access was denied.\n\n";
          errorMessage += "To enable:\n";
          errorMessage += "1. Click the lock icon (🔒) in the address bar\n";
          errorMessage += "2. Allow location access\n";
          errorMessage += "3. Refresh and try again\n\n";
          errorMessage += "Or enter your address manually below.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage += "📍 Your device's location is unavailable.\n\n";
          errorMessage += "Please enter your address manually.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage += "⏱️ Location request timed out.\n\n";
          errorMessage += "Please try again or enter your address manually.";
        } else {
          errorMessage += "Please enter your address manually below.";
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased to 15 seconds
        maximumAge: 0
      }
    );
  };

  const handleSubmit = () => {
    if (!address.trim()) {
      alert("Please enter an address or detect your location.");
      return;
    }
    
    if (onSelect) {
      onSelect({
        address: address.trim(),
        coordinates: mapCenter
      });
    }
  };

  const handleClose = () => {
    setAddress("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="📍 Select Delivery Location" size="lg">
      <div className="space-y-4">
        {/* Status Message */}
        {locationStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            locationStatus.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
            locationStatus.includes('⚠️') ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {locationStatus}
          </div>
        )}

        {/* Detect My Location Button */}
        <div className="flex justify-center">
          <button
            onClick={detectMyLocation}
            disabled={isLoading}
            className="bg-[#002579] hover:bg-[#001845] text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Detecting Location...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Detect My Location
              </>
            )}
          </button>
        </div>

        {/* Address Input Field */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your delivery address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter your full address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]"
          />
        </div>

        {/* Map Preview */}
        <div>
          <div className="relative">
            <iframe
              src={`https://maps.google.com/maps?q=${mapCenter}&output=embed`}
              className="w-full h-64 rounded-lg border border-gray-200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
              📍 Map Preview
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!address.trim()}
            className="px-6 py-2 bg-[#002579] text-white rounded-lg hover:bg-[#001845] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Set Location
          </button>
        </div>
      </div>
    </Modal>
  );
}
