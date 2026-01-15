"use client";

import { useState, useEffect } from "react";
import { Icons } from "./Icons";

export default function PopupBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        onClick={closePopup}
      />

      {/* Popup Banner */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center p-4 md:p-8">
        <div className="relative w-[280px] md:w-[400px] bg-white rounded-lg shadow-2xl overflow-hidden animate-scale-in mx-auto">
          {/* Close Button */}
          <button
            onClick={closePopup}
            className="absolute top-2 right-2 z-10 w-7 h-7 md:w-8 md:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Close popup"
          >
            <Icons.Close className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          {/* Banner Image */}
          <div onClick={closePopup} className="cursor-pointer">
            <img
              src="/starting banner.jpg"
              alt="Welcome to Life Pharmacy"
              className="w-full h-auto object-contain hover:opacity-95 transition-opacity"
            />
          </div>
        </div>
      </div>
    </>
  );
}
