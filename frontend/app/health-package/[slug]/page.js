"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Icons } from "@/components/Icons";
import { healthPackages } from "@/data/categories";
import { useCart } from "@/context/CartContext";

export default function HealthPackagePage() {
  const params = useParams();
  const { slug } = params;
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  
  // Find the health package
  const healthPackage = healthPackages.find(p => p.slug === slug);

  if (!healthPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h1>
          <p className="text-gray-600">The health package you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const packageItem = {
      id: healthPackage.id,
      _id: healthPackage.id,
      name: healthPackage.name,
      price: healthPackage.price,
      images: [healthPackage.image],
      slug: healthPackage.slug,
      brand: "Smart Health Pharmacy",
      stock: 100,
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(packageItem);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Package Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <img
              src={healthPackage.image}
              alt={healthPackage.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      {/* Package Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Package Info */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{healthPackage.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{healthPackage.description}</p>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Includes:</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive health screening and assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Consultation with healthcare professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Detailed health report and recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Follow-up support and guidance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Home delivery of medications and supplements</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits:</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icons.Check className="w-5 h-5 text-[#002579]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Expert Care</h3>
                      <p className="text-sm text-gray-600">Professional healthcare guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icons.Check className="w-5 h-5 text-[#002579]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Convenience</h3>
                      <p className="text-sm text-gray-600">Easy scheduling and home service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icons.Check className="w-5 h-5 text-[#002579]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Affordable</h3>
                      <p className="text-sm text-gray-600">Best value for comprehensive care</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icons.Check className="w-5 h-5 text-[#002579]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Quality</h3>
                      <p className="text-sm text-gray-600">Premium healthcare standards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-[#002579]">AED {healthPackage.price}</span>
                </div>
                <p className="text-sm text-gray-600">One-time package fee</p>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Icons.Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Icons.Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-xl font-bold text-[#002579]">AED {(healthPackage.price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-[#002579] text-white py-3 rounded-lg font-semibold hover:bg-[#001845] transition-colors flex items-center justify-center gap-2 mb-3"
              >
                <Icons.ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                  <span>100% Genuine Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Professional Healthcare Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Easy Booking Process</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm">
                  <a href="tel:+971501234567" className="flex items-center gap-2 text-[#002579] hover:underline">
                    <Icons.Phone className="w-4 h-4" />
                    +971 50 123 4567
                  </a>
                  <a href="mailto:info@smartpharmacy.com" className="flex items-center gap-2 text-[#002579] hover:underline">
                    <Icons.Mail className="w-4 h-4" />
                    info@smartpharmacy.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
