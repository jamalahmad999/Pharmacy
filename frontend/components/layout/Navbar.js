"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";
import LocationModal from "@/components/LocationModal";
import LocationMapModal from "@/components/LocationMapModal";
import LoginModal from "@/components/LoginModal";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// UAE Flag SVG Component
const UAEFlag = () => (
  <svg className="h-5 w-5" viewBox="0 0 27 18" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" fill="#00732F" />
    <rect width="27" height="12" y="6" fill="#FFFFFF" />
    <rect width="27" height="6" y="12" fill="#000000" />
    <rect width="8" height="18" fill="#FF0000" />
  </svg>
);

const SaudiFlag = () => (
  <svg className="h-6 w-6" viewBox="0 0 27 18" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" fill="#006C35" />
    <text x="13.5" y="12" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial">🕌</text>
  </svg>
);

const renderFlag = (countryCode) => {
  switch (countryCode) {
    case "AE":
      return <UAEFlag />;
    case "SA":
      return <SaudiFlag />;
    default:
      return <UAEFlag />;
  }
};

export default function Navbar() {
  const { getCartCount, toggleCart } = useCart();
  const { getWishlistCount, toggleWishlistSidebar } = useWishlist();
  const router = useRouter();
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  
  const phrases = ["supplements", "sunscreen", "vitamins", "face cream", "medicines", "skincare"];

  const [displayText, setDisplayText] = useState(phrases[0]);
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting
  const [charIndex, setCharIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: "AE", name: "United Arab Emirates" });
  const [deliveryLocation, setDeliveryLocation] = useState({ address: "Select delivery location", coordinates: null });
  const [user, setUser] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/admin/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      // Filter categories from API by name, slug, or description
      const filtered = categories.filter(cat =>
        cat.name?.toLowerCase().includes(searchLower) ||
        cat.slug?.toLowerCase().includes(searchLower) ||
        cat.description?.toLowerCase().includes(searchLower)
      ).map(cat => ({
        ...cat,
        link: `/products?category=${encodeURIComponent(cat.slug)}`
      }));
      
      setFilteredCategories(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setFilteredCategories([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, categories]);

  const handleCategoryClick = (category) => {
    router.push(`/products?category=${encodeURIComponent(category.slug)}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Read country and location from localStorage on mount
  useEffect(() => {
    try {
      const countryRaw = localStorage.getItem("lp_country");
      if (countryRaw) {
        setSelectedCountry(JSON.parse(countryRaw));
      }
      
      const locationRaw = localStorage.getItem("lp_delivery_location");
      if (locationRaw) {
        setDeliveryLocation(JSON.parse(locationRaw));
      }
      const userRaw = localStorage.getItem("lp_user");
      if (userRaw) {
        try { setUser(JSON.parse(userRaw)); } catch (e) { setUser(null); }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Typing effect for the placeholder
  useEffect(() => {
    let timeout;

    if (phase === "typing") {
      if (charIndex < phrases[phraseIndex].length) {
        timeout = setTimeout(() => setCharIndex((c) => c + 1), 80);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 900);
      }
    }

    if (phase === "deleting") {
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex((c) => c - 1), 40);
      } else {
        // move to next phrase
        const next = (phraseIndex + 1) % phrases.length;
        setPhraseIndex(next);
        setPhase("typing");
      }
    }

    if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 700);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, phase, phraseIndex]);

  useEffect(() => {
    setDisplayText(phrases[phraseIndex].slice(0, charIndex));
  }, [charIndex, phraseIndex]);

  function openLocationModal() {
    console.log('Location modal opening');
    setIsModalOpen(true);
  }

  function handleModalSelect(selection) {
    if (selection.type === "country") {
      setSelectedCountry(selection.country);
      try {
        localStorage.setItem("lp_country", JSON.stringify(selection.country));
      } catch (e) {}
    } else if (selection.type === "language") {
      // Handle language selection
      try {
        localStorage.setItem("lp_language", JSON.stringify(selection.language));
      } catch (e) {}
    }
    setIsModalOpen(false);
  }

  function handleLocationSelect(location) {
    setDeliveryLocation(location);
    try {
      localStorage.setItem("lp_delivery_location", JSON.stringify(location));
    } catch (e) {}
    setIsMapModalOpen(false);
  }

  return (
    <>
    <header className="bg-[#6EC6FF]/95 backdrop-blur-sm shadow-sm border-b border-[#4A9EFF] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 group transition-all duration-200">
              <div className="relative">
                <img 
                  src="/smart logo png no arabic.png" 
                  alt="Smart Pharmacy" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            </a>
          </div>

          {/* Middle: Search */}
          <div className="flex flex-1 px-6">
            <div className="max-w-2xl mx-auto w-full" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icons.Search className="h-5 w-5 text-gray-400 transition-colors duration-200 group-focus-within:text-[#FF4FA5]" />
                </div>
                <input
                  type="text"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                  placeholder={searchTerm ? '' : `Search for ${displayText}`}
                  className="w-full pl-12 pr-20 py-3 border border-gray-200 rounded-xl shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-[#FF4FA5]/20 focus:border-[#FF4FA5]
                           transition-all duration-200 group-hover:border-gray-300
                           bg-white text-black placeholder-gray-500
                           font-medium text-sm"
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setShowSuggestions(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Icons.Close className="h-5 w-5" />
                    </button>
                  </div>
                )}
                {!searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-gray-200 rounded-md text-xs text-gray-500 bg-white font-mono">
                      ⌘K
                    </kbd>
                  </div>
                )}
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && filteredCategories.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 mb-2 px-3 uppercase tracking-wide">Categories</div>
                      {filteredCategories.map((category, index) => (
                        <button
                          key={category._id || index}
                          type="button"
                          onClick={() => handleCategoryClick(category)}
                          className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg text-sm transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <Icons.Search className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 group-hover:text-[#002579] font-medium">{category.name}</span>
                          </div>
                          <Icons.ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#002579] opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                    {searchTerm.trim() && (
                      <div className="border-t border-gray-100 p-2">
                        <button
                          type="submit"
                          className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-lg text-sm transition-colors flex items-center gap-3 text-[#002579]"
                        >
                          <Icons.Search className="w-4 h-4" />
                          <span>Search for "<strong>{searchTerm}</strong>"</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right: Location + Icons */}
          <div className="flex items-center space-x-2">
            {/* Location Selector */}
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#4A9EFF] 
                       transition-all duration-200 group border border-transparent hover:border-[#FF4FA5]"
              title={`Change country (current: ${selectedCountry.name})`}
            >
              {renderFlag(selectedCountry.code)}
              <span className="text-sm font-medium text-white group-hover:text-white">
                {selectedCountry.code}
              </span>
              <Icons.ChevronDown className="h-4 w-4 ml-1 text-white" />
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-[#FF4FA5] mx-2"></div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  setIsLoginModalOpen(true);
                }}
                className="p-2.5 rounded-lg hover:bg-[#4A9EFF] transition-all duration-200 text-white hover:text-white relative group flex items-center gap-2" 
                title="Account"
              >
                {user ? (
                  <div className="flex items-center gap-2">
                    <Icons.CheckCircle className="w-5 h-5 text-[#FF4FA5]" />
                    <span className="text-sm font-medium text-white hidden sm:block">
                      {user.name ? user.name : (user.email ? user.email : 'Account')}
                    </span>
                  </div>
                ) : (
                  <>
                    <Icons.User className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#FF4FA5] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </>
                )}
              </button>

              <button 
                onClick={() => {
                  toggleWishlistSidebar();
                }}
                className="p-2.5 rounded-lg hover:bg-[#4A9EFF] transition-all duration-200 text-white hover:text-red-500 relative group" 
                title="Wishlist"
              >
                <Icons.Heart className="w-5 h-5" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {getWishlistCount()}
                  </span>
                )}
              </button>

              <button 
                onClick={() => {
                  toggleCart();
                }}
                className="p-2.5 rounded-lg hover:bg-[#4A9EFF] transition-all duration-200 text-white hover:text-[#FF4FA5] relative group" 
                title="Cart"
              >
                <Icons.ShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF4FA5] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* First Row: Logo | Location | Flag */}
          <div className="flex items-center justify-between h-14 py-2">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img 
                src="smart logo png no arabic.png" 
                alt="Smart Pharmacy" 
                className="h-10 w-auto object-contain"
              />
            </a>

            {/* Location Button (Middle) */}
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 
                       transition-all duration-200 flex-1 mx-2 max-w-[180px]"
            >
              <Icons.MapPin className="h-3.5 w-3.5 text-[#FF4FA5] flex-shrink-0" />
              <span className="text-white text-xs font-medium truncate">
                {deliveryLocation.address.length > 15 
                  ? deliveryLocation.address.substring(0, 15) + '...' 
                  : deliveryLocation.address}
              </span>
            </button>

            {/* Country Flag */}
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#4A9EFF] 
                       transition-all duration-200"
              title={`Change country (current: ${selectedCountry.name})`}
            >
              {renderFlag(selectedCountry.code)}
            </button>
          </div>

          {/* Second Row: Search Bar */}
          <div className="pb-2" ref={mobileSearchRef}>
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                placeholder={searchTerm ? '' : `Search for ${displayText}`}
                className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-[#FF4FA5]/20 focus:border-[#FF4FA5]
                         bg-white text-black placeholder-gray-400
                         text-sm"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setShowSuggestions(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icons.Close className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {/* Mobile Search Suggestions Dropdown */}
              {showSuggestions && filteredCategories.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-1 px-2 uppercase tracking-wide">Categories</div>
                    {filteredCategories.map((category, index) => (
                      <button
                        key={category._id || index}
                        type="button"
                        onClick={() => handleCategoryClick(category)}
                        className="w-full text-left px-2 py-2 hover:bg-blue-50 rounded-lg text-sm transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Icons.Search className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-700 font-medium">{category.name}</span>
                        </div>
                        <Icons.ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                    ))}
                  </div>
                  {searchTerm.trim() && (
                    <div className="border-t border-gray-100 p-2">
                      <button
                        type="submit"
                        className="w-full text-left px-2 py-2 hover:bg-blue-50 rounded-lg text-sm transition-colors flex items-center gap-2 text-[#002579]"
                      >
                        <Icons.Search className="w-3 h-3" />
                        <span>Search for "<strong>{searchTerm}</strong>"</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Hidden on Mobile */}
      <div className="hidden md:block bg-gradient-to-r from-[#FF4FA5] to-[#FF4FA5] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end py-1.5 text-sm">
            {/* Right: Delivery Location */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icons.MapPin className="h-4 w-4 text-purple-200" />
                <span className="text-purple-100">Deliver to:</span>
                <span className="text-white font-semibold">{deliveryLocation.address}</span>
              </div>
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="bg-[#E64595] hover:bg-[#CC3D85] px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold flex items-center gap-1"
              >
                Change
                <Icons.ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Modals - Rendered outside header to avoid z-index issues */}
      <LocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleModalSelect} />
      <LocationMapModal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} onSelect={handleLocationSelect} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={(u) => {
          setUser(u);
          try {
            localStorage.setItem("lp_user", JSON.stringify(u));
          } catch (e) {}
        }}
        user={user}
        alreadyLoggedIn={!!user}
      />
    </>
  );
}
