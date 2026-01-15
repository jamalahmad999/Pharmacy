"use client";

import { useCart } from "@/context/CartContext";
import { Icons } from "@/components/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over AED 100
  const total = subtotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">Review your items before checkout</p>
          
          <div className="bg-gray-50 rounded-lg p-12">
            <Icons.ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart to get started</p>
            <Link 
              href="/products"
              className="inline-block bg-[#002579] text-white px-6 py-3 rounded-lg hover:bg-[#001845] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{getCartCount()} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const productImage = item.images && item.images[0] 
                ? item.images[0] 
                : item.image 
                ? item.image 
                : '/placeholder-product.png';
              
              const itemPrice = item.salePrice && item.salePrice < item.price ? item.salePrice : item.price;
              const itemTotal = itemPrice * item.quantity;

              return (
                <div key={item.id || item._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                      <img
                        src={productImage}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg bg-gray-100"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-[#002579]">
                              {item.name}
                            </h3>
                          </Link>
                          {item.brand && (
                            <p className="text-sm text-gray-500 mt-1">
                              {typeof item.brand === 'object' ? item.brand.name : item.brand}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id || item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Icons.Close className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          {item.salePrice && item.salePrice < item.price ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-[#002579]">
                                AED {item.salePrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                AED {item.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-[#002579]">
                              AED {item.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-gray-900">
                            AED {itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-3 text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span className="font-medium">AED {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-medium">AED {tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `AED ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal < 100 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700">
                      Add <span className="font-bold">AED {(100 - subtotal).toFixed(2)}</span> more for FREE shipping!
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#002579]">AED {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-6 bg-[#002579] text-white py-3 px-6 rounded-lg hover:bg-[#001845] transition-colors font-semibold text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
