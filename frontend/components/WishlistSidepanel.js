"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icons } from "./Icons";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistSidepanel() {
  const {
    wishlist,
    isWishlistOpen,
    toggleWishlistSidebar,
    removeFromWishlist,
    getWishlistCount,
  } = useWishlist();
  const { addToCart } = useCart();

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isWishlistOpen]);

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (!isWishlistOpen) return null;

  const moveToCart = (itemId) => {
    // Implementation for moving to cart
    console.log("Move to cart:", itemId);
  };

  if (!isWishlistOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998] transition-all duration-300"
        style={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
        onClick={toggleWishlistSidebar}
      />
      
      {/* Sidepanel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-[9999] transform transition-transform duration-300 ease-in-out ${
        isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">My Wishlist</h2>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {getWishlistCount()}
              </span>
            </div>
            <button
              onClick={toggleWishlistSidebar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 text-center mb-4">Save items you love by clicking the heart icon</p>
                <button 
                  onClick={toggleWishlistSidebar}
                  className="bg-[#a92579] text-white px-6 py-2 rounded-lg hover:bg-[#8a1d63] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {wishlist.map((item) => {
                  // Handle both image formats: array (backend) or string (homepage)
                  const productImage = item.images && item.images[0] 
                    ? item.images[0] 
                    : item.image 
                    ? item.image 
                    : null;
                  
                  return (
                  <div key={item.id || item._id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {productImage ? (
                          <img src={productImage} alt={item.title || item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">💊</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.title || item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-gray-900">AED {item.price?.toFixed(2)}</span>
                        {item.stock > 0 ? (
                          <span className="text-xs bg-blue-100 text-[#002579] px-2 py-1 rounded-full">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}
                          className="flex-1 bg-[#a92579] text-white py-2 px-3 rounded-lg hover:bg-[#8a1d63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id || item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from wishlist"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button 
                onClick={toggleWishlistSidebar}
                className="w-full bg-[#a92579] text-white py-3 rounded-lg hover:bg-[#8a1d63] transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
