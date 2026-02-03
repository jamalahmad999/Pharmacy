"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";
import { brands as staticBrands, healthPackages } from "@/data/categories";
import { Suspense } from 'react';

// 1. Asli logic ko ek alag component mein rakhen
function CategoryBarContent({ isMobile = false, onClose = null, isPage = false }) {
  const [categories, setCategories] = useState([]);
  const [dbBrands, setDbBrands] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(false);
  const [hoveredPackages, setHoveredPackages] = useState(false);
  const [hoveredSubGroup, setHoveredSubGroup] = useState(null);
  const [categoryHideTimer, setCategoryHideTimer] = useState(null);
  const [brandHideTimer, setBrandHideTimer] = useState(null);
  const [packageHideTimer, setPackageHideTimer] = useState(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Set default hovered group for mobile page view
  useEffect(() => {
    if (isMobile && isPage && categories.length > 0) {
      const groupFromUrl = searchParams.get('group');
      const mainCategories = categories.filter(cat => !cat.parentCategory);
      const mainCategoryNames = mainCategories.map(cat => cat.name);
      
      if (groupFromUrl && mainCategoryNames.includes(groupFromUrl)) {
        setHoveredGroup(groupFromUrl);
      } else if (mainCategories.length > 0) {
        // Set default to first category and update URL
        const defaultGroup = mainCategories[0].name;
        setHoveredGroup(defaultGroup);
        // Update URL without causing a navigation
        const newParams = new URLSearchParams(searchParams);
        newParams.set('group', defaultGroup);
        router.replace(`?${newParams.toString()}`, { scroll: false });
      }
    }
  }, [categories, isMobile, isPage, searchParams, router]);

  // Sync hoveredGroup with URL changes (for back/forward navigation)
  useEffect(() => {
    if (isMobile && isPage && categories.length > 0) {
      const groupFromUrl = searchParams.get('group');
      const mainCategories = categories.filter(cat => !cat.parentCategory);
      const mainCategoryNames = mainCategories.map(cat => cat.name);
      
      if (groupFromUrl && mainCategoryNames.includes(groupFromUrl) && groupFromUrl !== hoveredGroup) {
        setHoveredGroup(groupFromUrl);
      } else if (!groupFromUrl && hoveredGroup && mainCategoryNames.length > 0) {
        // If no group in URL but we have a hoveredGroup, set default
        const defaultGroup = mainCategories[0].name;
        setHoveredGroup(defaultGroup);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('group', defaultGroup);
        router.replace(`?${newParams.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, isMobile, isPage, categories, hoveredGroup, router]);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('🔗 Fetching from:', `${apiUrl}/api/admin/categories`);
      const timestamp = new Date().getTime();
      const response = await fetch(`${apiUrl}/api/admin/categories?t=${timestamp}`);
      console.log('📡 Response status:', response.status, response.ok);
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Fetched categories:', data.length);
        console.log('🏷️  Main categories:', data.filter(c => !c.parentCategory).map(c => c.name));
        console.log('📂 Subcategories:', data.filter(c => c.parentCategory).length);
        console.log('📋 Raw data sample:', data.slice(0, 3));
        setCategories(data || []);
      } else {
        console.error('❌ Failed to fetch categories:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${apiUrl}/api/admin/brands?t=${timestamp}`);
      if (response.ok) {
        const data = await response.json();
        setDbBrands(data || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Combine static brands with database brands
  const allBrands = [...staticBrands, ...dbBrands.map(b => ({
    id: b._id,
    name: b.name,
    slug: b.slug,
    logo: b.logo
  }))];

  // Get all main categories from database
  const mainCategories = categories.filter(cat => !cat.parentCategory);
  
  // Group subcategories and sub-subcategories under their main categories
  const groupedCategories = {};
  
  mainCategories.forEach(mainCat => {
    // Get all direct subcategories (level 2)
    const subcats = categories.filter(cat => {
      if (!cat.parentCategory) return false;
      
      // If parentCategory is an object (populated)
      if (typeof cat.parentCategory === 'object' && cat.parentCategory._id) {
        return String(cat.parentCategory._id) === String(mainCat._id);
      }
      // If parentCategory is just an ID string
      return String(cat.parentCategory) === String(mainCat._id);
    });
    
    // For each subcategory, get its sub-subcategories (level 3)
    const subcatsWithChildren = subcats.map(subcat => {
      const subsubcats = categories.filter(cat => {
        if (!cat.parentCategory) return false;
        
        if (typeof cat.parentCategory === 'object' && cat.parentCategory._id) {
          return String(cat.parentCategory._id) === String(subcat._id);
        }
        return String(cat.parentCategory) === String(subcat._id);
      });
      
      return {
        ...subcat,
        children: subsubcats
      };
    });
    
    groupedCategories[mainCat.name] = subcatsWithChildren;
    console.log(`${mainCat.name}: ${subcatsWithChildren.length} subcategories`, subcatsWithChildren.map(s => `${s.name} (${s.children.length} sub-sub)`));
  });
  
  console.log('📊 All main categories:', Object.keys(groupedCategories));

  if (isMobile) {
    const content = (
      <>
          {/* Main Categories Sidebar */}
          <div className="w-20 bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-2 border-b border-gray-200">
              <button
                onClick={onClose}
                className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors flex justify-center"
              >
                <Icons.Close className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {Object.keys(groupedCategories).map((groupName) => {
                const mainCat = mainCategories.find(cat => cat.name === groupName);
                return (
                  <button
                    key={groupName}
                    onClick={() => {
                      const newGroup = hoveredGroup === groupName ? null : groupName;
                      setHoveredGroup(newGroup);
                      if (isPage) {
                        // Update URL for page navigation
                        const newParams = new URLSearchParams(searchParams);
                        if (newGroup) {
                          newParams.set('group', newGroup);
                        } else {
                          newParams.delete('group');
                        }
                        router.replace(`?${newParams.toString()}`, { scroll: false });
                      }
                    }}
                    className={`w-full p-2 flex flex-col items-center gap-1 hover:bg-white transition-colors ${
                      hoveredGroup === groupName ? 'bg-white border-r-2 border-blue-500' : ''
                    }`}
                  >
                    {mainCat?.image ? (
                      <img
                        src={mainCat.image.startsWith('http') ? mainCat.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${mainCat.image}`}
                        alt={mainCat.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : mainCat?.icon ? (
                      <span className="text-2xl">{mainCat.icon}</span>
                    ) : (
                      <Icons.Menu className="w-10 h-10 text-gray-400" />
                    )}
                    <span className="text-xs text-center leading-tight text-gray-700">{groupName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories and Sub-subcategories Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {hoveredGroup && groupedCategories[hoveredGroup] ? (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">{hoveredGroup}</h2>
                  <div className="space-y-4">
                    {groupedCategories[hoveredGroup].map((subcategory) => (
                      <div key={subcategory._id}>
                        <Link
                          href={`/products?category=${subcategory.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors block"
                        >
                          {subcategory.image && (
                            <img
                              src={subcategory.image.startsWith('http') ? subcategory.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${subcategory.image}`}
                              alt={subcategory.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <span className="font-medium text-gray-900">{subcategory.name}</span>
                        </Link>

                        {/* Sub-subcategories */}
                        {subcategory.children && subcategory.children.length > 0 && (
                          <div className="ml-6 mt-2 grid grid-cols-3 gap-3">
                            {subcategory.children.map((subsubcategory) => (
                              <Link
                                key={subsubcategory._id}
                                href={`/products?category=${subsubcategory.slug}`}
                                onClick={onClose}
                              className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                {subsubcategory.image && (
                                  <img
                                    src={subsubcategory.image.startsWith('http') ? subsubcategory.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${subsubcategory.image}`}
                                    alt={subsubcategory.name}
                                    className="w-16 h-16 md:w-12 md:h-12 object-cover rounded-lg"
                                  />
                                )}
                                <span className="text-xs text-gray-600 text-center leading-tight">{subsubcategory.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Select a category
                </div>
              )}
            </div>
          </div>
        </>
      );

    if (isPage) {
      return <div className="bg-white flex min-h-screen">{content}</div>;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden">
        <div className="absolute inset-x-0 top-0 bottom-16 bg-white flex">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm fixed top-16 left-0 right-0 z-40 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left Side: Shop by Category */}
          <div className="flex items-center gap-6">
            {/* Shop by Category Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (categoryHideTimer) clearTimeout(categoryHideTimer);
                setShowCategories(true);
              }}
              onMouseLeave={() => {
                const timer = setTimeout(() => {
                  setShowCategories(false);
                  setHoveredGroup(null);
                  setHoveredSubGroup(null);
                }, 500);
                setCategoryHideTimer(timer);
              }}
            >
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 hover:text-blue-800"
              >
                <Icons.Menu className="w-5 h-5" />
                <span className="text-sm">Shop by Category</span>
                <Icons.ChevronDown className="w-4 h-4" />
              </button>

              {/* 3-Column Mega Dropdown */}
              {showCategories && (
                <div className="absolute left-0 top-full mt-1 w-[900px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex animate-fadeIn">
                  {/* Main Category Groups */}
                  <div className="w-1/4 border-r border-gray-100 bg-gray-50">
                    {Object.keys(groupedCategories).map((groupName) => {
                      const mainCat = mainCategories.find(cat => cat.name === groupName);
                      return (
                        <div key={groupName} className="relative">
                          <Link
                            href={`/products?category=${mainCat?.slug || ''}`}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-white transition-colors duration-150 ${hoveredGroup === groupName ? 'bg-white font-bold text-blue-800' : 'text-gray-700 hover:text-blue-800'}`}
                            onMouseEnter={() => setHoveredGroup(groupName)}
                          >
                            {mainCat?.image && (
                              <img 
                                src={mainCat.image.startsWith('http') ? mainCat.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${mainCat.image}`} 
                                alt={mainCat.name}
                                className="w-6 h-6 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <span className="text-sm">
                                {groupName}
                              </span>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* Subcategories in selected group */}
                  <div className="w-1/3 border-r border-gray-100 bg-white p-4 max-h-[400px] overflow-y-auto">
                    {hoveredGroup && groupedCategories[hoveredGroup] ? (
                      <div>
                        {groupedCategories[hoveredGroup].length > 0 ? (
                          <div className="space-y-1">
                            {groupedCategories[hoveredGroup].map((subcategory) => (
                              <Link
                                key={subcategory._id}
                                href={`/products?category=${subcategory.slug}`}
                                className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                                onMouseEnter={() => setHoveredSubGroup(subcategory)}
                              >
                                {subcategory.image && (
                                  <img 
                                    src={subcategory.image.startsWith('http') ? subcategory.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${subcategory.image}`} 
                                    alt={subcategory.name}
                                    className="w-5 h-5 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <span>
                                    {subcategory.name}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">No subcategories yet</div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Hover a category group
                      </div>
                    )}
                  </div>

                  {/* Sub-subcategories */}
                  <div className="w-5/12 bg-white p-4 max-h-[400px] overflow-y-auto">
                    {hoveredSubGroup && hoveredSubGroup.children ? (
                      <div>
                        {hoveredSubGroup.children.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {hoveredSubGroup.children.map((subsubcategory) => (
                              <Link
                                key={subsubcategory._id}
                                href={`/products?category=${subsubcategory.slug}`}
                                className="flex flex-col items-center gap-2 text-xs text-gray-700 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 shadow-sm"
                              >
                                {subsubcategory.image && (
                                  <img 
                                    src={subsubcategory.image.startsWith('http') ? subsubcategory.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${subsubcategory.image}`} 
                                    alt={subsubcategory.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                <span className="text-center leading-tight">{subsubcategory.name}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">No sub-subcategories yet</div>
                        )}
                      </div>
                    ) : hoveredGroup && groupedCategories[hoveredGroup] && groupedCategories[hoveredGroup].length > 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Hover a subcategory
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Select a subcategory
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shop by Brand Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (brandHideTimer) clearTimeout(brandHideTimer);
                setHoveredBrand(true);
              }}
              onMouseLeave={() => {
                const timer = setTimeout(() => {
                  setHoveredBrand(false);
                }, 500);
                setBrandHideTimer(timer);
              }}
            >
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 hover:text-blue-800">
                <span className="text-sm">Shop by Brand</span>
                <Icons.ChevronDown className="w-4 h-4" />
              </button>

              {/* Brand Dropdown */}
              {hoveredBrand && (
                <div className="absolute left-0 top-full mt-1 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm">Popular Brands</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                      {allBrands.map((brand) => (
                        <Link
                          key={brand.id || brand._id}
                          href={`/brand/${brand.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-blue-700 group"
                        >
                          {brand.logo ? (
                            <div className="w-16 h-8 bg-white rounded flex items-center justify-center overflow-hidden">
                              <img
                                src={brand.logo.startsWith('http') ? brand.logo : brand.logo.startsWith('/uploads/') ? `https://backend-smart.vercel.app${brand.logo}` : brand.logo}
                                alt={brand.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Icons.Tag className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <span className="text-xs font-medium text-gray-700 group-hover:text-blue-800">
                            {brand.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 p-3 bg-gray-50">
                    <Link
                      href="/brands"
                      className="text-sm font-semibold text-blue-800 hover:text-blue-900 flex items-center justify-center gap-2"
                    >
                      View All Brands
                      <Icons.ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Health Packages Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (packageHideTimer) clearTimeout(packageHideTimer);
                setHoveredPackages(true);
              }}
              onMouseLeave={() => {
                const timer = setTimeout(() => {
                  setHoveredPackages(false);
                }, 500);
                setPackageHideTimer(timer);
              }}
            >
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 hover:text-blue-800">
                <span className="text-sm">Health Packages</span>
                <Icons.ChevronDown className="w-4 h-4" />
              </button>

              {/* Health Packages Dropdown */}
              {hoveredPackages && (
                <div className="absolute left-0 top-full mt-1 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm">Featured Health Packages</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {healthPackages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          href={`/health-package/${pkg.slug}`}
                          className="block rounded-lg overflow-hidden border border-gray-100 hover:border-blue-700 hover:shadow-lg transition-all duration-200 group"
                        >
                          <div className="h-24 overflow-hidden">
                            <img
                              src={pkg.image}
                              alt={pkg.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="p-3 bg-white">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-blue-800">
                              {pkg.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">{pkg.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-blue-800">AED {pkg.price}</span>
                              <Icons.ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-800 group-hover:translate-x-1 transition-all duration-200" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Prescription Button */}
          <div>
            <Link
              href="/prescriptions"
              className="flex items-center gap-2 px-6 py-2 bg-transparent hover:bg-blue-800 text-blue-800 hover:text-white border-2 border-blue-800 rounded-lg transition-all duration-200 font-semibold text-sm hover:scale-105"
            >
              <Icons.Upload className="w-5 h-5" />
              <span>Prescription</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Main component mein usay Suspense se wrap karein
export default function CategoryBar({ isMobile = false, onClose = null, isPage = false }) {
  return (
    <Suspense fallback={
      <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm fixed top-16 left-0 right-0 z-40 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="text-sm text-gray-500">Loading categories...</div>
          </div>
        </div>
      </div>
    }>
      <CategoryBarContent 
        isMobile={isMobile} 
        onClose={onClose} 
        isPage={isPage} 
      />
    </Suspense>
  );
}
