"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard, Icons } from "@/components";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);

  useEffect(() => {
    fetchCategories();
    
    // Set category from URL query parameter
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    
    setSelectedCategory(categoryFromUrl || '');
    setSearchQuery(searchFromUrl || '');
    
    // Always fetch products initially
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    // Update selectedCategoryData when selectedCategory changes
    if (selectedCategory) {
      const selectedCat = categories.find(c => c.slug === selectedCategory);
      setSelectedCategoryData(selectedCat || null);
    } else {
      setSelectedCategoryData(null);
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    // Filter products whenever filters change or allProducts is loaded
    if (allProducts.length > 0) {
      filterProducts();
    }
  }, [selectedCategory, searchQuery, selectedBrands, priceRange, allProducts]);

  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/products?limit=1600`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setAllProducts(data.data);
      
      // Calculate max price and extract brands
      if (data.data.length > 0) {
        const prices = data.data.map(p => p.price);
        const max = Math.max(...prices);
        setMaxPrice(max);
        setPriceRange([0, max]);
        
        // Extract unique brands - handle both string and object brands
        const uniqueBrands = [...new Set(data.data.map(p => {
          if (!p.brand) return null;
          return typeof p.brand === 'object' ? p.brand.name : p.brand;
        }).filter(Boolean))];
        setBrands(uniqueBrands.sort());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filterProducts = () => {
    if (allProducts.length === 0) {
      console.warn('No products loaded for filtering');
      return;
    }
    
    let filtered = [...allProducts];

    // If no filters are applied, show all products
    const hasFilters = selectedCategory || searchQuery || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;
    
    if (!hasFilters) {
      setProducts(filtered);
      setLoading(false);
      return;
    }

    // Filter by category slug
    if (selectedCategory) {
      const selectedCat = categories.find(c => c.slug === selectedCategory);
      if (selectedCat) {
        // Get all category IDs that should be included
        let categoryIds = [selectedCat._id];
        
        // Determine the level of the selected category
        let isMainCategory = !selectedCat.parentCategory;
        let isSubcategory = false;
        let isSubSubcategory = false;
        
        if (selectedCat.parentCategory) {
          // Find the parent category
          const parentId = typeof selectedCat.parentCategory === 'object' ? selectedCat.parentCategory._id : selectedCat.parentCategory;
          const parentCat = categories.find(c => c._id === parentId);
          
          if (parentCat) {
            if (!parentCat.parentCategory) {
              // Parent has no parent, so selectedCat is a subcategory (level 2)
              isSubcategory = true;
            } else {
              // Parent has a parent, so selectedCat is a sub-subcategory (level 3)
              isSubSubcategory = true;
            }
          }
        }
        
        // If it's a main category, include all subcategories and sub-subcategories
        if (isMainCategory) {
          const subcategories = getSubcategories(selectedCat._id);
          const subSubcategories = subcategories.flatMap(sub => getSubSubcategories(sub._id));
          categoryIds = [
            selectedCat._id,
            ...subcategories.map(sub => sub._id),
            ...subSubcategories.map(subsub => subsub._id)
          ];
        } 
        // If it's a subcategory, include all its sub-subcategories
        else if (isSubcategory) {
          const subSubcategories = getSubSubcategories(selectedCat._id);
          categoryIds = [selectedCat._id, ...subSubcategories.map(subsub => subsub._id)];
        }
        // If it's a sub-subcategory, just include itself
        
        filtered = filtered.filter(p => {
          if (!p.category) return false;
          const productCategoryId = typeof p.category === 'object' ? p.category._id : p.category;
          return categoryIds.includes(productCategoryId);
        });
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const brandName = typeof p.brand === 'object' ? p.brand?.name : p.brand;
        return p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          brandName?.toLowerCase().includes(query);
      });
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => {
        const brandName = typeof p.brand === 'object' ? p.brand?.name : p.brand;
        return selectedBrands.includes(brandName);
      });
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setProducts(filtered);
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const timestamp = new Date().getTime();
      // Use admin endpoint to get all category data including banners
      const response = await fetch(`${apiUrl}/api/admin/categories?t=${timestamp}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
  };

  // Organize categories into hierarchy
  const mainCategories = categories.filter(cat => !cat.parentCategory);
  const getSubcategories = (parentId) => categories.filter(cat => {
    if (!cat.parentCategory) return false;
    
    // Handle both string and object parentCategory
    if (typeof cat.parentCategory === 'object' && cat.parentCategory._id) {
      return cat.parentCategory._id === parentId;
    }
    return cat.parentCategory === parentId;
  });
  const getSubSubcategories = (parentId) => categories.filter(cat => {
    if (!cat.parentCategory) return false;
    
    // Handle both string and object parentCategory
    if (typeof cat.parentCategory === 'object' && cat.parentCategory._id) {
      return cat.parentCategory._id === parentId;
    }
    return cat.parentCategory === parentId;
  });
  const getProductsByCategory = (categoryId) => allProducts.filter(p => {
    const productCategoryId = typeof p.category === 'object' ? p.category._id : p.category;
    return productCategoryId === categoryId;
  });

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const isCategoryExpanded = (categoryId) => expandedCategories.has(categoryId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Left Sidebar - Filters */}
          <aside className={`${showMobileFilter ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="p-6">
                <h2 className="font-bold text-lg mb-4">Filters</h2>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Categories with Expandable Hierarchy */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                  <div className="space-y-1">
                    <button
                      onClick={() => router.push('/products')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === '' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      All Products
                    </button>
                    
                    {mainCategories.map((mainCat) => {
                      const subcategories = getSubcategories(mainCat._id);
                      const isExpanded = isCategoryExpanded(mainCat._id);
                      
                      return (
                        <div key={mainCat._id} className="mb-1">
                          {/* Main Category */}
                          <button
                            onClick={() => {
                              toggleCategoryExpansion(mainCat._id);
                              router.push(`/products?category=${mainCat.slug}`);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                              selectedCategory === mainCat.slug ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-gray-800'
                            }`}
                          >
                            <span className="text-sm">
                              {isExpanded ? '−' : '+'}
                            </span>
                            <span>{mainCat.name}</span>
                          </button>

                          {/* Subcategories - Only show if expanded */}
                          {isExpanded && subcategories.length > 0 && (
                            <div className="ml-4 space-y-1 mt-1">
                              {subcategories.map((subCat) => {
                                const subSubcategories = getSubSubcategories(subCat._id);
                                const isSubExpanded = isCategoryExpanded(subCat._id);
                                
                                return (
                                  <div key={subCat._id}>
                                    <button
                                      onClick={() => {
                                        toggleCategoryExpansion(subCat._id);
                                        router.push(`/products?category=${subCat.slug}`);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                                        selectedCategory === subCat.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-600'
                                      }`}
                                    >
                                      <span className="text-xs">
                                        {subSubcategories.length > 0 ? (isSubExpanded ? '−' : '+') : '•'}
                                      </span>
                                      <span>{subCat.name}</span>
                                    </button>

                                    {/* Sub-subcategories - Only show if expanded */}
                                    {isSubExpanded && subSubcategories.length > 0 && (
                                      <div className="ml-4 space-y-1 mt-1">
                                        {subSubcategories.map((subSubCat) => (
                                          <button
                                            key={subSubCat._id}
                                            onClick={() => router.push(`/products?category=${subSubCat.slug}`)}
                                            className={`w-full text-left px-3 py-1 rounded-lg transition-colors text-xs flex items-center gap-2 ${
                                              selectedCategory === subSubCat.slug ? 'bg-blue-25 text-blue-500 font-medium' : 'hover:bg-gray-25 text-gray-500'
                                            }`}
                                          >
                                            <span className="text-xs">•</span>
                                            <span>{subSubCat.name}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6 pb-6 border-b">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Brand</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                    {brands.length === 0 && (
                      <p className="text-sm text-gray-400">No brands available</p>
                    )}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>AED {priceRange[0]}</span>
                      <span>AED {priceRange[1]}</span>
                    </div>
                    
                    {/* Min Price Slider */}
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    
                    {/* Max Price Slider */}
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* Price Input Fields */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden mb-4 flex items-center gap-2">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                aria-label="Open filters"
              >
                <Icons.Filter className="w-5 h-5" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>

            {/* Category Banner */}
            {selectedCategoryData?.banner && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={selectedCategoryData.banner} 
                  alt={selectedCategoryData.name}
                  className="w-full h-auto max-h-60 object-cover"
                />
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                    setSelectedBrands([]);
                    setPriceRange([0, maxPrice]);
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="text-xs md:text-sm text-gray-600">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                  </div>
                  {(selectedBrands.length > 0 || selectedCategory) && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedBrands.map(brand => (
                        <span key={brand} className="inline-flex items-center gap-1 px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {brand}
                          <button onClick={() => toggleBrand(brand)} className="hover:text-blue-900 text-sm">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 lg:gap-6 justify-items-center md:justify-items-start">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray bg-opacity-50"
            onClick={() => setShowMobileFilter(false)}
          />
          
          {/* Filter Panel */}
          <div className="absolute bottom-0 right-0 w-full max-w-sm bg-white h-[70vh] overflow-y-auto rounded-t-lg shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                <div className="space-y-1">
                  <button
                    onClick={() => router.push('/products')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === '' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                  
                  {mainCategories.map((mainCat) => {
                    const subcategories = getSubcategories(mainCat._id);
                    
                    return (
                      <div key={mainCat._id} className="mb-2">
                        <button
                          onClick={() => router.push(`/products?category=${mainCat.slug}`)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-medium ${
                            selectedCategory === mainCat.slug ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          {mainCat.name}
                        </button>

                        {subcategories.length > 0 && (
                          <div className="ml-4 space-y-1 mt-1">
                            {subcategories.map((subCat) => {
                              const subSubcategories = getSubSubcategories(subCat._id);
                              
                              return (
                                <div key={subCat._id}>
                                  <button
                                    onClick={() => router.push(`/products?category=${subCat.slug}`)}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors text-sm ${
                                      selectedCategory === subCat.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                  >
                                    {subCat.name}
                                  </button>

                                  {subSubcategories.length > 0 && (
                                    <div className="ml-4 space-y-1 mt-1">
                                      {subSubcategories.map((subSubCat) => (
                                        <button
                                          key={subSubCat._id}
                                          onClick={() => router.push(`/products?category=${subSubCat.slug}`)}
                                          className={`w-full text-left px-3 py-1 rounded-lg transition-colors text-xs ${
                                            selectedCategory === subSubCat.slug ? 'bg-blue-25 text-blue-500 font-medium' : 'hover:bg-gray-25 text-gray-500'
                                          }`}
                                        >
                                          {subSubCat.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Brand</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>AED {priceRange[0]}</span>
                    <span>AED {priceRange[1]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setSelectedBrands([]);
                  setPriceRange([0, maxPrice]);
                  setShowMobileFilter(false);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.Loader className="w-12 h-12 text-[#002579] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}