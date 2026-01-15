"use client";

import { useState } from "react";
import Link from "next/link";
import { Icons } from "./Icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const inWishlist = isInWishlist(product.id || product._id);

  return (
    <Link
      href={`/products/${product.slug}`}
      scroll={true}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative border border-gray-100 hover:border-[#002579] block min-w-[115px] max-w-[165px] sm:min-w-[125px] sm:max-w-[180px] md:min-w-[140px] md:max-w-[200px]"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-white p-2">
        <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
          <img
            src={product.images && product.images[0] ? product.images[0] : '/placeholder-product.png'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md z-10"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Icons.Heart
            className={`w-5 h-5 transition-colors ${
              inWishlist ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
            filled={inWishlist}
          />
        </button>

        {/* Discount Badge */}
        {product.salePrice && product.salePrice < product.price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
          </div>
        )}

        {/* Stock Badge */}
        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            Only {product.stock} left
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 bg-white">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-medium text-[#002579] uppercase tracking-wide mb-2">
            {typeof product.brand === 'object' ? product.brand.name : product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-[#002579] transition-colors min-h-[40px] leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && product.rating.average > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icons.Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating.average)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {product.rating.average.toFixed(1)}
            </span>
            {product.rating.count > 0 && (
              <span className="text-xs text-gray-400">({product.rating.count})</span>
            )}
          </div>
        )}

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="mb-3 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-4 mt-2">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="text-xs px-2 pr-4 font-bold text-[#002579]">
                  AED{typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : product.salePrice}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  AED {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>
              </>
            ) : (
              <span className="text-xs font-bold text-[#002579]">
                AED {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
            )}
          </div>
          {product.salePrice && product.salePrice < product.price && (
            <div className="flex items-center gap-2 mt-0">
              <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded">
                Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm ${
            product.stock === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
              : isAdding
              ? "bg-green-600 text-white shadow-green-200"
              : "bg-[#002579] hover:bg-[#001845] text-white hover:shadow-md hover:shadow-blue-200"
          }`}
        >
          {isAdding ? (
            <>
              <Icons.CheckCircle className="w-4 h-4" />
              Added!
            </>
          ) : (
            <>
              <Icons.ShoppingBag className="w-4 h-4" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </button>
      </div>
    </Link>
  );
}