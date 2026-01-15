"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    onClose();
  };

  const inWishlist = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-product.png'];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Icons.Close className="w-6 h-6 text-gray-600" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Left Column - Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-6">
                {/* Brand */}
                {product.brand && (
                  <div className="text-sm text-gray-500 font-medium">{product.brand}</div>
                )}

                {/* Product Name */}
                <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>

                {/* Category */}
                {product.category && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {product.category.name}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-blue-600">AED {product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">AED {product.originalPrice}</span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.stock > 0 ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-green-700 font-medium">In Stock ({product.stock} available)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-red-700 font-medium">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* SKU */}
                {product.sku && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">SKU:</span> {product.sku}
                  </div>
                )}

                {/* Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">{key}</div>
                          <div className="text-sm font-medium text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quantity and Actions */}
                {product.stock > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700 font-medium">Quantity:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Icons.Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Icons.Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Icons.ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                          inWishlist
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Icons.Heart
                          className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
