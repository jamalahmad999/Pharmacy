"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Icons } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import { ProductDetailModal } from "@/components";

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Get the last slug part (the actual product category)
  const categorySlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categorySlug]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Fetch category details
      const categoryResponse = await fetch(`${apiUrl}/api/admin/categories`);
      const categoriesData = await categoryResponse.json();
      const allCategories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];
      const foundCategory = allCategories.find(cat => cat.slug === categorySlug);
      
      setCategory(foundCategory);

      // Fetch products for this category
      if (foundCategory) {
        // Find all subcategories (children) of this category
        const subcategoryIds = allCategories
          .filter(cat => {
            const parentId = cat.parentCategory?._id || cat.parentCategory;
            return parentId === foundCategory._id;
          })
          .map(cat => cat._id);
        
        // Include the main category and all its subcategories
        const categoryIdsToFilter = [foundCategory._id, ...subcategoryIds];
        
        const productsResponse = await fetch(`${apiUrl}/api/products`);
        const productsData = await productsResponse.json();
        const categoryProducts = (productsData.data || []).filter(product => {
          const productCategoryId = product.category?._id || product.category;
          return categoryIdsToFilter.includes(productCategoryId);
        });
        setProducts(categoryProducts);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-3 md:py-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <a href="/" className="hover:text-[#002579] transition-colors">Home</a>
            <Icons.ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            <a href="/products" className="hover:text-[#002579] transition-colors">Products</a>
            {category && (
              <>
                <Icons.ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                <span className="font-semibold text-gray-900 truncate">{category.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-4 md:py-8">
        <div className="flex gap-4 md:gap-8">
          {/* Sidebar Filters - Hidden on mobile */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-32">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Filters</h2>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {["Under AED 25", "AED 25 - AED 50", "AED 50 - AED 100", "Over AED 100"].map((range) => (
                    <label key={range} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#002579] cursor-pointer">
                      <input type="checkbox" className="rounded text-[#002579] focus:ring-[#002579]" />
                      <span>{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Brand</h3>
                <div className="space-y-2">
                  {["Himalaya", "L'Oreal", "Garnier", "Dove", "Neutrogena"].map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#002579] cursor-pointer">
                      <input type="checkbox" className="rounded text-[#002579] focus:ring-[#002579]" />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#002579] cursor-pointer">
                      <input type="checkbox" className="rounded text-[#002579] focus:ring-[#002579]" />
                      <span className="flex items-center gap-1">
                        <Icons.CheckCircle className="w-4 h-4 text-yellow-400" />
                        {stars}+ Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{category?.name || "Products"}</h1>
                <p className="text-sm md:text-base text-gray-600">{products.length} products found</p>
              </div>
              
              {/* Sort */}
              <select className="px-3 md:px-4 py-2 border border-gray-200 rounded-lg text-xs md:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002579] focus:border-[#002579]">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
                <option>Newest</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600 text-base md:text-lg">No products found in this category</p>
                <p className="text-gray-500 mt-2 text-sm md:text-base">Check back later or browse other categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                {products.map((product) => (
                  <div key={product._id} onClick={() => handleProductClick(product)}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
