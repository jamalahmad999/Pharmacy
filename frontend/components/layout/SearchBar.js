'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

// Static categories data for search
const staticCategories = [
  // Shop by Category section
  { name: "Collagen", slug: "collagen", link: "/products?category=collagen", keywords: ["collagen", "skin", "anti-aging", "beauty"] },
  { name: "Mother & Baby Care", slug: "mother-baby-care", link: "/products?category=mother%20%26%20baby%20care", keywords: ["mother", "baby", "care", "infant", "child", "maternity"] },
  { name: "Personal Care", slug: "personal-care", link: "/products?category=personal%20care", keywords: ["personal", "care", "hygiene", "body"] },
  { name: "Family Planning", slug: "family-planning", link: "/products?category=family%20planning", keywords: ["family", "planning", "contraception"] },
  { name: "OTC Medicines", slug: "otc-medicines", link: "/products?category=otc%20medicines", keywords: ["otc", "medicines", "over the counter", "medicine", "pharmacy", "drug"] },
  { name: "Nutrition & Supplements", slug: "nutrition-supplements", link: "/products?category=nutrition+%26+supplements", keywords: ["nutrition", "supplements", "vitamins", "health"] },
  { name: "Home Healthcare", slug: "home-healthcare", link: "/products?category=home%20healthcare", keywords: ["home", "healthcare", "medical", "equipment"] },
  
  // Button section categories
  { name: "Fish Oils", slug: "fish-oils", link: "/products?category=fish-oils", keywords: ["fish", "oil", "omega", "omega-3", "fatty acids"] },
  { name: "Face Sunscreen", slug: "face-sunscreen", link: "/products?category=face-sunscreen", keywords: ["sunscreen", "sun", "spf", "uv", "face", "protection", "sunblock"] },
  { name: "Vitamin C", slug: "vitamin-c", link: "/products?category=vitamin-c", keywords: ["vitamin", "vitamin c", "ascorbic", "immunity", "immune"] },
  { name: "Creatine", slug: "creatine", link: "/products?category=creatine", keywords: ["creatine", "muscle", "workout", "gym", "fitness", "sports"] },
  { name: "BP Monitors", slug: "bp-monitors", link: "/products?category=bp-monitors", keywords: ["bp", "blood pressure", "monitor", "heart", "cardiovascular"] },
  { name: "Baby Food & Nutrition", slug: "baby-food-nutrition", link: "/products?category=baby%20food%20%26%20nutrition", keywords: ["baby", "food", "nutrition", "infant", "formula", "cereal"] },
  { name: "Protein", slug: "protein", link: "/products?category=protein", keywords: ["protein", "whey", "muscle", "fitness", "gym", "workout"] },
  { name: "Multivitamin", slug: "multivitamin", link: "/products?category=multivitamin", keywords: ["multivitamin", "vitamins", "daily", "health", "supplement"] },
  { name: "Beauty Supplements", slug: "beauty-supplements", link: "/products?category=beauty%20supplements", keywords: ["beauty", "supplements", "skin", "hair", "nails", "glow"] },
  
  // Additional common categories
  { name: "Skincare", slug: "skincare", link: "/products?category=skincare", keywords: ["skin", "skincare", "face", "moisturizer", "cleanser", "serum"] },
  { name: "Hair Care", slug: "hair-care", link: "/products?category=hair-care", keywords: ["hair", "shampoo", "conditioner", "hair care", "scalp"] },
  { name: "Makeup", slug: "makeup", link: "/products?category=makeup", keywords: ["makeup", "cosmetics", "lipstick", "foundation", "mascara"] },
  { name: "Pain Relief", slug: "pain-relief", link: "/products?category=pain-relief", keywords: ["pain", "relief", "painkiller", "headache", "ache"] },
  { name: "Diabetes Care", slug: "diabetes-care", link: "/products?category=diabetes-care", keywords: ["diabetes", "diabetic", "sugar", "glucose", "insulin"] },
  { name: "First Aid", slug: "first-aid", link: "/products?category=first-aid", keywords: ["first aid", "bandage", "wound", "antiseptic", "emergency"] },
  { name: "Oral Care", slug: "oral-care", link: "/products?category=oral-care", keywords: ["oral", "dental", "teeth", "toothpaste", "mouthwash", "toothbrush"] },
  { name: "Eye Care", slug: "eye-care", link: "/products?category=eye-care", keywords: ["eye", "eyes", "vision", "drops", "lens"] },
  { name: "Weight Management", slug: "weight-management", link: "/products?category=weight-management", keywords: ["weight", "loss", "diet", "slim", "fat", "burn"] },
  { name: "Sports Nutrition", slug: "sports-nutrition", link: "/products?category=sports-nutrition", keywords: ["sports", "nutrition", "energy", "workout", "gym", "athlete"] },
];

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  
  const placeholders = [
    'Search for supplements...',
    'Search for sunscreen...',
    'Search for medicines...',
    'Search for vitamins...',
    'Search for skincare...',
    'Search for baby care...',
    'Search for personal care...',
    'Search for health products...'
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/categories`);
      if (response.ok) {
        const data = await response.json();
        // API returns array directly, not wrapped in data property
        setCategories(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      // Filter API categories by name
      const filteredApiCategories = categories.filter(cat =>
        cat.name?.toLowerCase().includes(searchLower) ||
        cat.slug?.toLowerCase().includes(searchLower)
      ).map(cat => ({
        ...cat,
        type: 'api',
        link: `/products?category=${encodeURIComponent(cat.name.toLowerCase())}`
      }));
      
      // Filter static categories by name and keywords
      const filteredStaticCategories = staticCategories.filter(cat => {
        const nameMatch = cat.name.toLowerCase().includes(searchLower);
        const keywordMatch = cat.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower) || 
          searchLower.includes(keyword.toLowerCase())
        );
        return nameMatch || keywordMatch;
      }).map(cat => ({
        ...cat,
        type: 'static',
        _id: cat.slug
      }));
      
      // Combine - API categories first, then static ones that don't exist in API
      const combined = [...filteredApiCategories];
      filteredStaticCategories.forEach(staticCat => {
        const exists = combined.some(c => 
          c.name?.toLowerCase() === staticCat.name?.toLowerCase()
        );
        if (!exists) {
          combined.push(staticCat);
        }
      });
      
      setFilteredCategories(combined.slice(0, 10)); // Limit to 10 results
      setShowSuggestions(true);
    } else {
      setFilteredCategories([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, categories]);

  const handleCategoryClick = (category) => {
    if (category.link) {
      router.push(category.link);
    } else {
      router.push(`/products?category=${category._id}`);
    }
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

  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;

    const typeEffect = () => {
      const fullText = placeholders[placeholderIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setCurrentPlaceholder(currentText);

      let typeSpeed = 100;

      if (isDeleting) {
        typeSpeed = 50;
      }

      if (!isDeleting && currentText === fullText) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        typeSpeed = 500; // Pause before starting new word
      }

      timeoutId = setTimeout(typeEffect, typeSpeed);
    };

    // Only run the effect if user is not typing
    if (!isTyping) {
      typeEffect();
    }

    return () => clearTimeout(timeoutId);
  }, [placeholderIndex, isTyping, placeholders]);

  const handleFocus = () => {
    setIsTyping(true);
    setCurrentPlaceholder('Search for products...');
  };

  const handleBlur = () => {
    if (!searchTerm) {
      setIsTyping(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={(e) => {
            // Delay to allow click on suggestions
            setTimeout(() => handleBlur(e), 200);
          }}
          placeholder={currentPlaceholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Category Suggestions Dropdown */}
      {showSuggestions && filteredCategories.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-3">Categories</div>
            {filteredCategories.map((category, index) => (
              <button
                key={category._id || index}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg text-sm transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <Icons.Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 group-hover:text-blue-800">{category.name}</span>
                </div>
                <Icons.ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>
          {searchTerm.trim() && (
            <div className="border-t border-gray-100 p-2">
              <button
                type="submit"
                className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg text-sm transition-colors flex items-center gap-2 text-blue-600"
              >
                <Icons.Search className="w-4 h-4" />
                <span>Search for "{searchTerm}"</span>
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
