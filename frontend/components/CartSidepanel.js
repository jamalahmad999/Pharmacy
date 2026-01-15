"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icons } from "./Icons";
import { useCart } from "@/context/CartContext";

export default function CartSidepanel() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] transition-all duration-300"
        style={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidepanel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-[9999] transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center gap-2">
              <Icons.ShoppingBag className="h-6 w-6 text-[#002579]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart
              </h2>
              <span className="bg-[#002579] text-white text-xs px-2 py-1 rounded-full">
                {getCartCount()}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close cart"
            >
              <Icons.Close className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <Icons.ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  Add some products to get started
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#002579] text-white px-6 py-2 rounded-lg hover:bg-[#001845] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.map((item) => {
                  // Handle both image formats: array (backend) or string (homepage)
                  const productImage = item.images && item.images[0] 
                    ? item.images[0] 
                    : item.image 
                    ? item.image 
                    : '/placeholder-product.png';
                  
                  return (
                  <div
                    key={item.id || item._id}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#002579] transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={productImage}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.brand && (
                        <p className="text-sm text-gray-500">
                          {typeof item.brand === 'object' ? item.brand.name : item.brand}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                          {item.salePrice && item.salePrice < item.price ? (
                            <>
                              <span className="text-lg font-bold text-[#002579]">
                                AED {item.salePrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                AED {item.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-[#002579]">
                              AED {item.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id || item._id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Icons.Close className="h-3 w-3 rotate-90" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id || item._id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Icons.Check className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium text-gray-900">
                          Total: AED {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id || item._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer - Order Summary */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50">
              {/* Summary */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>AED {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `AED ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#002579]">
                    Free shipping on orders over AED 50!
                  </p>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>AED {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="p-4 pt-0">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-[#002579] text-white py-3 rounded-lg hover:bg-[#001845] transition-colors font-medium text-center"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-2 text-[#002579] py-2 text-sm hover:text-[#001845] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

