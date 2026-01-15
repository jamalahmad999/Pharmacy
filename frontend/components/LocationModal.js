"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

// SVG Flag Components
const UAEFlag = ({ size = "h-8 w-8" }) => (
  <svg className={size} viewBox="0 0 27 18" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" fill="#00732F" />
    <rect width="27" height="12" y="6" fill="#FFFFFF" />
    <rect width="27" height="6" y="12" fill="#000000" />
    <rect width="8" height="18" fill="#FF0000" />
  </svg>
);

const SaudiFlag = ({ size = "h-8 w-8" }) => (
  <svg className={size} viewBox="0 0 27 18" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" fill="#006C35" />
    <text x="13.5" y="12" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial">🕌</text>
  </svg>
);

export default function LocationModal({ isOpen, onClose, onSelect }) {
  const [currentView, setCurrentView] = useState("main"); // main, country, language
  const [selectedCountry, setSelectedCountry] = useState({ code: "AE", name: "United Arab Emirates" });
  const [selectedLanguage, setSelectedLanguage] = useState({ code: "en", name: "English" });

  const countries = [
    { code: "AE", name: "United Arab Emirates", flagComponent: UAEFlag },
    { code: "SA", name: "Saudi Arabia", flagComponent: SaudiFlag },
  ];

  const languages = [
    { code: "en", name: "English", dir: "ltr" },
    { code: "ar", name: "العربية", dir: "rtl" },
  ];

  function handleCountrySelect(country) {
    setSelectedCountry(country);
    if (onSelect) {
      onSelect({ 
        type: "country", 
        country: { code: country.code, name: country.name }
      });
    }
    setCurrentView("main");
  }

  function handleLanguageSelect(language) {
    setSelectedLanguage(language);
    if (onSelect) {
      onSelect({ 
        type: "language", 
        language: language
      });
    }
    setCurrentView("main");
  }

  function handleClose() {
    setCurrentView("main");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="🌍 Settings" size="md">
      <div className="space-y-4">
        {currentView === "main" && (
          <>
            {/* Country & Language Options */}
            <div className="space-y-3">
              {/* Country Option */}
              <button
                onClick={() => setCurrentView("country")}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-[#002579]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Country</div>
                    <div className="text-sm text-gray-500">{selectedCountry.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCountry.code === "AE" ? <UAEFlag size="h-6 w-6" /> : <SaudiFlag size="h-6 w-6" />}
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Language Option */}
              <button
                onClick={() => setCurrentView("language")}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Language</div>
                    <div className="text-sm text-gray-500">{selectedLanguage.name}</div>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}

        {currentView === "country" && (
          <>
            {/* Back Button */}
            <button
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              Back
            </button>

            {/* Country Options */}
            <div className="space-y-3">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                    selectedCountry.code === country.code
                      ? "border-[#002579] bg-blue-50"
                      : "border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <country.flagComponent size="h-8 w-8" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{country.name}</div>
                    <div className="text-sm text-gray-500">{country.code}</div>
                  </div>
                  {selectedCountry.code === country.code && (
                    <svg className="h-5 w-5 text-[#002579]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {currentView === "language" && (
          <>
            {/* Back Button */}
            <button
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              Back
            </button>

            {/* Language Options */}
            <div className="space-y-3">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                    selectedLanguage.code === language.code
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">{language.code.toUpperCase()}</span>
                    </div>
                    <div className="font-semibold text-gray-900">{language.name}</div>
                  </div>
                  {selectedLanguage.code === language.code && (
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
