"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const productId = product.id || product._id;
      const exists = prevWishlist.find((item) => (item.id || item._id) === productId);
      if (!exists) {
        return [...prevWishlist, { ...product, id: productId }];
      }
      return prevWishlist;
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => (item.id || item._id) !== productId)
    );
  };

  // Toggle item in wishlist
  const toggleWishlist = (product) => {
    const productId = product.id || product._id;
    const exists = wishlist.find((item) => (item.id || item._id) === productId);
    if (exists) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item._id) === productId);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Toggle wishlist sidebar
  const toggleWishlistSidebar = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    isWishlistOpen,
    toggleWishlistSidebar,
    setIsWishlistOpen,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
