"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import { findProductBySlug, getRelatedProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart: addToCartContext, toggleCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
      // Scroll to top when navigating to a new product
      window.scrollTo(0, 0);
    }
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // First, try to find in static products
      const staticProduct = findProductBySlug(params.slug);
      
      if (staticProduct) {
        // It's a static product from homepage
        setProduct(staticProduct);
        const related = getRelatedProducts(staticProduct);
        setRelatedProducts(related);
        setLoading(false);
        return;
      }
      
      // If not found in static, try API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products/${params.slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/products');
          return;
        }
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setProduct(data.data);
      // For API products, you might want to fetch related products differently
      setRelatedProducts([]);
    } catch (error) {
      console.error('Error:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product || product.stock === 0) return;
    
    setIsAdding(true);
    
    // Add the product with selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCartContext(product);
    }
    
    // Show success state briefly
    setTimeout(() => {
      setIsAdding(false);
      toggleCart(); // Open cart sidebar to show added items
    }, 500);
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 mb-4 md:mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImage === idx ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {product.category && (
                <Link href={`/products?category=${product.category._id}`} className="inline-block text-xs md:text-sm text-blue-600 hover:underline mb-4">
                  {product.category.name}
                </Link>
              )}

              <div className="flex flex-wrap items-baseline gap-2 md:gap-3 mb-4 md:mb-6">
                {product.salePrice && product.salePrice < product.price ? (
                  <>
                    <span className="text-2xl md:text-3xl font-bold text-blue-600">AED {product.salePrice}</span>
                    <span className="text-lg md:text-xl text-gray-500 line-through">AED {product.price}</span>
                    <span className="text-xs md:text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-blue-600">AED {product.price}</span>
                )}
              </div>

              <div className="mb-4 md:mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{product.description}</p>
              </div>

              {product.brand && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Brand: </span>
                  <span className="font-medium text-gray-900">{typeof product.brand === 'object' ? product.brand.name : product.brand}</span>
                </div>
              )}

              {product.sku && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">SKU: </span>
                  <span className="font-medium text-gray-900">{product.sku}</span>
                </div>
              )}

              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center gap-2 md:gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isAdding}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-gray-300 hover:bg-gray-100 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        disabled={isAdding}
                        className="w-16 md:w-20 text-center border border-gray-300 rounded-lg py-2 text-sm md:text-base disabled:opacity-50"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={isAdding}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-gray-300 hover:bg-gray-100 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                      {quantity > 1 && (
                        <div className="ml-2 text-sm text-gray-600">
                          Total: <span className="font-bold text-[#002579]">
                            AED {((product.salePrice && product.salePrice < product.price ? product.salePrice : product.price) * quantity).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={addToCart}
                      disabled={isAdding}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold transition-all text-sm md:text-base ${
                        isAdding
                          ? 'bg-green-600 text-white'
                          : 'bg-[#002579] hover:bg-[#001845] text-white'
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <Icons.CheckCircle className="w-5 h-5" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <Icons.ShoppingBag className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleToggleWishlist}
                      className={`w-12 md:w-14 h-10 md:h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isInWishlist(product.id || product._id)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Icons.Heart
                        className={`w-5 h-5 md:w-6 md:h-6 ${
                          isInWishlist(product.id || product._id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-gray-400'
                        }`}
                        filled={isInWishlist(product.id || product._id)}
                      />
                    </button>
                  </div>
                </div>
              )}

              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Specifications</h3>
                  <dl className="space-y-2">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex text-xs md:text-sm">
                        <dt className="text-gray-600 w-1/3">{spec.key}:</dt>
                        <dd className="text-gray-900 w-2/3 font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t mt-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'border-b-2 border-[#002579] text-[#002579]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#002579] text-[#002579]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews {product.rating?.count > 0 && `(${product.rating.count})`}
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  {product.category && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Category:</span> {typeof product.category === 'object' ? product.category.name : product.category}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-6 pb-6 border-b">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-[#002579]">
                        {product.rating?.average ? product.rating.average.toFixed(1) : '0.0'}
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Icons.Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating?.average || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.rating?.count || 0} reviews
                      </p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = product.reviews && product.reviews.length > 0
                          ? (product.reviews.filter(r => Math.floor(r.rating) === star).length / product.reviews.length) * 100
                          : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600 w-12">{star} star</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-12 text-right">
                              {product.reviews ? product.reviews.filter(r => Math.floor(r.rating) === star).length : 0}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#002579] to-[#0039b3] rounded-full flex items-center justify-center text-white font-semibold">
                              {review.userInitial || review.userName?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{review.userName || 'Anonymous'}</h4>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Icons.Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                {review.verified && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified Purchase</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {review.date ? new Date(review.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }) : 'Recently'}
                              </p>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Dummy reviews when no reviews exist
                      <>
                        <div className="border-b pb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#002579] to-[#0039b3] rounded-full flex items-center justify-center text-white font-semibold">
                              A
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">Ahmed K.</h4>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Icons.Star
                                      key={i}
                                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified Purchase</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">2 weeks ago</p>
                              <p className="text-gray-700">
                                Excellent product! Exactly as described. Fast delivery and great quality. Highly recommended!
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#a92579] to-[#d63384] rounded-full flex items-center justify-center text-white font-semibold">
                              S
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">Sara M.</h4>
                                <div className="flex">
                                  {[...Array(4)].map((_, i) => (
                                    <Icons.Star
                                      key={i}
                                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                  <Icons.Star className="w-4 h-4 text-gray-300" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">1 month ago</p>
                              <p className="text-gray-700">
                                Very good product. Works as expected. The only reason for 4 stars is the price could be better.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-semibold">
                              M
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">Mohammed A.</h4>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Icons.Star
                                      key={i}
                                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified Purchase</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">3 weeks ago</p>
                              <p className="text-gray-700">
                                Been using this for a month now and I can see the difference. Great value for money!
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banners */}
        <div className="mt-8 grid grid-cols-2 gap-2">
          <div className="w-full">
            <img
              src="/new.gif"
              alt="New Banner 1"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="w-full">
            <img
              src="/new1.jpeg"
              alt="New Banner 2"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
