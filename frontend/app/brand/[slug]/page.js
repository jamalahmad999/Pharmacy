"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Icons } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import { brands as staticBrands } from "@/data/categories";

export default function BrandPage() {
  const params = useParams();
  const { slug } = params;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  
  useEffect(() => {
    fetchBrandData();
  }, [slug]);

  const fetchBrandData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // First try to find brand from database
      const brandsResponse = await fetch(`${apiUrl}/api/admin/brands`);
      let brandData = null;
      
      if (brandsResponse.ok) {
        const allDbBrands = await brandsResponse.json();
        brandData = allDbBrands.find(b => b.slug === slug);
      }
      
      // If not found in database, try static brands
      if (!brandData) {
        const staticBrand = staticBrands.find(b => b.slug === slug);
        if (staticBrand) {
          brandData = {
            _id: staticBrand.id,
            name: staticBrand.name,
            slug: staticBrand.slug,
            logo: staticBrand.logo
          };
        }
      }
      
      if (!brandData) {
        setLoading(false);
        setBrand(null);
        return;
      }
      
      setBrand(brandData);
      
      // Fetch products for this brand
      const productsResponse = await fetch(`${apiUrl}/api/products?brand=${encodeURIComponent(brandData.name)}`);
      if (productsResponse.ok) {
        const data = await productsResponse.json();
        const filteredProducts = (data.data || []).filter(product => 
          product.brand && 
          (typeof product.brand === 'string' 
            ? product.brand.toLowerCase() === brandData.name.toLowerCase()
            : product.brand.name.toLowerCase() === brandData.name.toLowerCase())
        );
        setProducts(filteredProducts);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brand data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#002579]"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Brand not found</h1>
          <p className="text-gray-600">The brand you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <div className="bg-[#002579] text-white">
        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-8 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-xl md:rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-xl">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                <Icons.Tag className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">{brand.name}</h1>
              <p className="text-sm md:text-base lg:text-lg text-white/90 mb-3 md:mb-4">Explore our wide range of {brand.name} products</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 text-xs md:text-sm">
                <span className="flex items-center gap-1 md:gap-2">
                  <Icons.CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Authentic Products
                </span>
                <span className="flex items-center gap-1 md:gap-2">
                  <Icons.CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Fast Delivery
                </span>
                <span className="flex items-center gap-1 md:gap-2">
                  <Icons.CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Best Prices
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-3 md:py-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <a href="/" className="hover:text-[#002579] transition-colors">Home</a>
            <Icons.ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            <a href="/brands" className="hover:text-[#002579] transition-colors">Brands</a>
            <Icons.ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-semibold text-gray-900">{brand.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">All {brand.name} Products</h2>
            <p className="text-sm md:text-base text-gray-600">
              {loading ? 'Loading...' : `${products.length} products available`}
            </p>
          </div>
          
          {/* Sort */}
          {products.length > 0 && (
            <select className="px-3 md:px-4 py-2 border border-gray-200 rounded-lg text-xs md:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Rated</option>
              <option>Newest</option>
            </select>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12 md:py-20">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-[#002579]"></div>
          </div>
        ) : products.length === 0 ? (
          /* No Products */
          <div className="text-center py-12 md:py-20">
            <div className="mb-4">
              <Icons.ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-sm md:text-base text-gray-600">
              We don't have any {brand.name} products available at the moment.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
