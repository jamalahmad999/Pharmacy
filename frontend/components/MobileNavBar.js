"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import LoginModal from "@/components/LoginModal";
import { Icons } from "@/components/Icons";
import CategoryBar from "@/components/layout/CategoryBar";

export default function MobileNavBar() {
  const { toggleCart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 w-screen bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-[#6EC6FF] transition-colors"
          >
            <Icons.Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          {/* Category */}
          <Link
            href="/categories"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-[#6EC6FF] transition-colors"
          >
            <Icons.Menu className="w-6 h-6" />
            <span className="text-xs mt-1">Category</span>
          </Link>

          {/* Upload (Prescriptions) */}
          <Link
            href="/prescriptions"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-[#6EC6FF] transition-colors"
          >
            <Icons.Upload className="w-6 h-6" />
            <span className="text-xs mt-1">Upload</span>
          </Link>

          {/* Account (Login Modal) */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-[#6EC6FF] transition-colors"
          >
            <Icons.User className="w-6 h-6" />
            <span className="text-xs mt-1">Account</span>
          </button>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-[#6EC6FF] transition-colors"
          >
            <Icons.ShoppingCart className="w-6 h-6" />
            <span className="text-xs mt-1">Cart</span>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Add padding to body to account for fixed navbar */}
      <style jsx>{`
        body {
          padding-bottom: 4rem;
        }
      `}</style>
    </>
  );
}