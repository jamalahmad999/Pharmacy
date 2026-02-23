"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";

const slides = [
  {
    id: 1,
    title: "Healthcare at Your Doorstep",
    description: "Order medicines and health products with fast delivery across UAE",
    image: "/herobanner (1).jpg",
    buttonText: "Shop Now",
    buttonLink: "/category/medicines",
    bgColor: "from-blue-600 to-cyan-600"
  },
  {
    id: 2,
    title: "Up to 50% Off on Beauty Products",
    description: "Discover amazing deals on top beauty and skincare brands",
    image: "/herobanner (2).jpg",
    buttonText: "Explore Deals",
    buttonLink: "/category/beauty",
    bgColor: "from-pink-600 to-purple-600"
  },
  {
    id: 3,
    title: "Complete Health Packages",
    description: "Comprehensive health checkups at affordable prices",
    image: "/herobanner (1).png",
    buttonText: "View Packages",
    buttonLink: "/health-packages",
    bgColor: "from-[#002579] to-[#a92579]"
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [exclusiveProducts, setExclusiveProducts] = useState([]);
  const [exclusiveProductsLoading, setExclusiveProductsLoading] = useState(true);
  const [premiumPicks, setPremiumPicks] = useState([]);
  const [premiumPicksLoading, setPremiumPicksLoading] = useState(true);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [elderlyCareProducts, setElderlyCareProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentServiceBanner, setCurrentServiceBanner] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = 'https://pharmacy-9yls.vercel.app';
      
      // Fetch general products (enough for both sections)
      try {
        console.log('Fetching products for homepage sections...');
        const response = await fetch(`${apiUrl}/api/products?limit=50`);
        console.log('Products API response:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          const allProducts = data.data || [];
          console.log('Total products fetched:', allProducts.length);
          
          if (allProducts.length > 0) {
            // First 10 products for Exclusive Deals
            setExclusiveProducts(allProducts.slice(0, 10));
            setExclusiveProductsLoading(false);
            console.log('Exclusive Deals products:', allProducts.slice(0, 10).length);
            
            // Next 10 products (11-20) for Premium Picks
            setPremiumPicks(allProducts.slice(10, 20));
            setPremiumPicksLoading(false);
            console.log('Premium Picks products:', allProducts.slice(10, 20).length);
            
            // Next 20 products (21-40) for Trending Products
            setTrendingProducts(allProducts.slice(20, 40));
            console.log('Trending products:', allProducts.slice(20, 40).length);
            
            // Next 10 products (41-50) for Elderly Care Products
            setElderlyCareProducts(allProducts.slice(40, 50));
            console.log('Elderly care products:', allProducts.slice(40, 50).length);
            
            // All products for other sections
            setProducts(allProducts);
          } else {
            console.log('No products found, showing empty state');
            setExclusiveProducts([]);
            setExclusiveProductsLoading(false);
            setPremiumPicks([]);
            setPremiumPicksLoading(false);
            setTrendingProducts([]);
            setElderlyCareProducts([]);
            setProducts([]);
          }
        } else {
          console.log('Products API failed, showing empty state');
          setExclusiveProducts([]);
          setExclusiveProductsLoading(false);
          setPremiumPicks([]);
          setPremiumPicksLoading(false);
          setTrendingProducts([]);
          setElderlyCareProducts([]);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setExclusiveProducts([]);
        setExclusiveProductsLoading(false);
        setPremiumPicks([]);
        setPremiumPicksLoading(false);
        setTrendingProducts([]);
        setElderlyCareProducts([]);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      // Fallback to static data if API fails
      setExclusiveProducts(exclusiveDealsProducts.slice(0, 10));
      setPremiumPicks(premiumPicksStatic.slice(0, 10));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll service banners every 4 seconds
  useEffect(() => {
    const serviceBannerTimer = setInterval(() => {
      setCurrentServiceBanner((prev) => (prev + 1) % 2);
    }, 4000);

    return () => clearInterval(serviceBannerTimer);
  }, []);

  // Auto scroll exclusive deals banners every 5 seconds
  useEffect(() => {
    const exclusiveBannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 2);
    }, 5000);

    return () => clearInterval(exclusiveBannerTimer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className=" pb-6 md:pb-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-1 md:py-2">
          {/* Top Banner - Desktop Only */}
          <div className="mb-0 hidden mt-0 md:block">
            <img 
              src="/top gif banner (2).gif" 
              alt="Largest Pharmacy Network in UAE"
              className="w-full max-w-full h-full object-contain"
            />
          </div>

          {/* Mobile Offer Banner */}
          <div className="mb-4 md:hidden flex items-center justify-between gap-0 pt-2 px-4">
            <h2 className="text-gray-800 text-sm font-bold flex-1">
              AED 25 OFF on First Purchase
            </h2>
            <button className="bg-[#002579] hover:bg-[#001845] text-white font-semibold py-1 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap text-sm">
              Buy Now
            </button>
          </div>

          {/* Mobile Button Images - Below AED 25 OFF */}
          <div className="md:hidden flex gap-2 px-4 mb-0">
            <a href="#" className="flex-1 overflow-hidden rounded-[10px]">
              <img 
                src="top buttons - mobile view (1).png" 
                alt="Button 1"
                className="w-full h-auto object-contain block"
              />
            </a>
            <a href="#" className="flex-1 overflow-hidden rounded-[10px]">
              <img 
                src="top buttons - mobile view (2).gif" 
                alt="Button 2"
                className="w-full h-auto object-contain block"
              />
            </a>
            <a href="#" className="flex-1 overflow-hidden rounded-[10px]">
              <img 
                src="top buttons - mobile view.png" 
                alt="Button 3"
                className="w-full h-auto object-contain block"
              />
            </a>
          </div>

          {/* Best Price Banner - Mobile Only */}
          <div className="md:hidden px-0 mb-4">
            <div className="overflow-hidden rounded-[10px]">
              <img 
                src="/Best Prescription - Mobile View.png" 
                alt="Best Price Banner"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>

          {/* Quality Want Banner - Attached to top of slider - Hidden on Mobile */}
          <div className="mb-0 hidden md:block overflow-hidden">
            <img 
              src="/quality-want.png" 
              alt="Quality Banner"
              className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110"
            />
          </div>

          {/* Slider */}
          <div className="px-4 md:px-0">
            <div className="relative overflow-hidden shadow-xl rounded-[10px] md:rounded-none group">
              {/* Slides */}
              <div className="relative h-auto">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`transition-opacity duration-700 ${
                      index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
                    }`}
                  >
                    {/* Image with Brightness Effect on All Images */}
                    <div className="relative overflow-hidden rounded-[10px] md:rounded-none">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-auto object-contain transition-all duration-500 ease-out group-hover:brightness-110 rounded-[10px] md:rounded-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-20"
                aria-label="Previous slide"
              >
                <Icons.ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-[#002579]" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-20"
                aria-label="Next slide"
              >
                <Icons.ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-[#002579]" />
              </button>
            </div>

            {/* Dots Indicator - Below Slider */}
            {/* <div className="flex items-center justify-center gap-1 md:gap-2 mt-3 md:mt-4 md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-8 h-3 bg-gray-800 md:bg-white"
                      : "w-3 h-3 bg-gray-400 md:bg-white/50 hover:bg-gray-600 md:hover:bg-white/75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 space-y-8 md:space-y-16 pb-8 md:pb-16">
        
        

       { /* Categories Section */}
          <section className="py-0 md:py-0">
            <h2 className="hidden md:block text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-0 md:mb-4 text-center">Shop by Category</h2>
            
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto scrollbar-hide mb-0">
              <div className="flex gap-3 pb-0" style={{ width: 'max-content' }}>
                {[
                  { name: "Collagen", image: "/1.png", link: "/products?category=collagen" },
                  { name: "Mother & Baby Care", image: "/2.png", link: "/products?category=mother%20baby%20care" },
                  { name: "Personal Care", image: "/3.png", link: "/products?category=personal%20care" },
                  { name: "Family Planning", image: "/4.png", link: "/products?category=family%20planning" },
                  { name: "OTC Medicines", image: "/5.png", link: "/products?category=otc%20medicines" },
                  { name: "Nutrition & Supplements", image: "/6.png", link: "/products?category=sports%20nutrition" },
                  { name: "Home Healthcare", image: "/7.png", link: "/products?category=home%20healthcare" },
                ].map((category, index) => (
                  <a
                    key={index}
                    href={category.link}
                    className="group flex flex-col items-center text-center flex-shrink-0"
                    style={{ width: '100px' }}
                  >
                    <div className="w-full aspect-square mb-0 transition-all duration-300 group-hover:scale-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-110"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-7 gap-0">
              {[
                { name: "Collagen", image: "/1.png", link: "/products?category=collagen" },
                  { name: "Mother & Baby Care", image: "/2.png", link: "/products?category=mother%20baby%20care" },
                  { name: "Personal Care", image: "/3.png", link: "/products?category=personal%20care" },
                  { name: "Family Planning", image: "/4.png", link: "/products?category=family%20planning" },
                  { name: "OTC Medicines", image: "/5.png", link: "/products?category=otc%20medicines" },
                  { name: "Nutrition & Supplements", image: "/6.png", link: "/products?category=sports%20nutrition" },
                  { name: "Home Healthcare", image: "/7.png", link: "/products?category=home%20healthcare" },
              ].map((category, index) => (
                <a
                  key={index}
                  href={category.link}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square mb-2 transition-all duration-300 group-hover:scale-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-110"
                    />
                  </div>
                </a>
              ))}
            </div>

            {/* 11.11 Mega Sale Banner - Mobile Only */}
            <div className="md:hidden px-4 mt-0">
              <div className="overflow-hidden rounded-[10px]">
                <img 
                  src="/11 11 best price.jpg" 
                  alt="11.11 Mega Sale"
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>

            {/* Two Banners Below Categories */}
            <div className="grid grid-cols-2 gap-2 md:gap-6 mt-4 md:mt-4">
              <a href="#" className="block overflow-hidden rounded-[10px] md:rounded-[20px] transition-all duration-300 relative">
                <img 
                  src="/Smart Pharmacy banner (final) 4 (1).png" 
                  alt="Smart Pharmacy Banner"
                  className="w-full h-auto object-cover transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
                {/* Right Arrow for Mobile */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentBanner(1);
                  }}
                  className="md:hidden absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md"
                  aria-label="Next banner"
                >
                  <Icons.ChevronRight className="w-4 h-4 text-[#002579]" />
                </button>
              </a>
              <a href="#" className="block overflow-hidden rounded-[10px] md:rounded-[20px] transition-all duration-300">
                <img 
                  src="/Smart Pharmacy banner (final) 4.gif" 
                  alt="Smart Pharmacy Animated Banner"
                  className="w-full h-auto object-cover transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
              </a>
            </div>
          </section>

          {/* Mobile Banner Images Section */}
          <section className="md:hidden py-0">
            <div className="grid grid-cols-4 gap-2">
              {[
                { image: "https://life-cdn.lifepharmacy.com/images/08-24/MU8RLgAndxNKEUXrUvhDS0IPSq0RdXUOi7lqVUQp.png", link: "#" },
                { image: "https://lifeadmin-app.s3.me-south-1.amazonaws.com/mobile-app/homescreen/collect-gift/collect-gift-1.gif", link: "#" },
                { image: "https://lifeadmin-app.s3.me-south-1.amazonaws.com/mobile-app/homescreen/001/rent.gif", link: "#" },
                { image: "https://life-cdn.lifepharmacy.com/images/09-25/fIhWRZSeIMhxvKM8Lt6fZctFCBAjCcAY1KHCeeVt.png", link: "#" },
                { image: "https://life-cdn.lifepharmacy.com/images/11-25/D0XApQEeelfFl3FGal88nYZeGBjCkfy2W17cMP6i.png", link: "#" },
                { image: "https://lifeadmin-app.s3.me-south-1.amazonaws.com/mobile-app/homescreen/001/kbea.gif", link: "#" },
                { image: "https://life-cdn.lifepharmacy.com/images/08-24/Mzlk9J3QEs5bxsl5Cm3MFpEbYvnG4HkpkHykXsRd.png", link: "#" },
                { image: "https://life-cdn.lifepharmacy.com/images/11-25/gnZkZjsh7hU58JWYofs2h5NIMFLIvP1GScv48HLz.png", link: "#" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="group block bg-blue-50 hover:bg-blue-50 hover:brightness-110 transition-all duration-300 rounded-lg overflow-hidden"
                >
                  <div className="aspect-square p-0">
                    <img
                      src={item.image}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Two Banners Row - Free Delivery & Quality Want */}
          <section className="py-0">
            {/* Mobile: Auto-scrolling banners */}
            <div className="md:hidden relative overflow-hidden rounded-[10px]">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentServiceBanner * 100}%)` }}
              >
                <a href="#" className="flex-shrink-0 w-full block overflow-hidden rounded-[10px] transition-all duration-300">
                  <img 
                    src="/free-delivery.png" 
                    alt="Free Delivery"
                    className="w-full h-auto object-cover transition-all duration-300 hover:brightness-120 hover:scale-100"
                  />
                </a>
                <a href="#" className="flex-shrink-0 w-full block overflow-hidden rounded-[10px] transition-all duration-300">
                  <img 
                    src="/quality-want2.png" 
                    alt="Quality Want"
                    className="w-full h-auto object-cover transition-all duration-300 hover:brightness-120 hover:scale-100"
                  />
                </a>
              </div>
              
              {/* Progress Indicators */}
              {/* <div className="flex justify-center gap-2 mt-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentServiceBanner ? "bg-blue-600 w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div> */}
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden md:grid grid-cols-2 gap-6">
              <a href="#" className="block overflow-hidden rounded-[10px] transition-all duration-300">
                <img 
                  src="/free-delivery.png" 
                  alt="Free Delivery"
                  className="w-full h-auto object-cover transition-all duration-300 hover:brightness-120 hover:scale-100"
                />
              </a>
              <a href="#" className="block overflow-hidden transition-all duration-300">
                <img 
                  src="/quality-want2.png" 
                  alt="Quality Want"
                  className="w-full h-auto object-cover transition-all duration-300 hover:brightness-120 hover:scale-100"
                />
              </a>
            </div>
          </section>

          {/* Exclusive Deals Section */}
        <section className="py-0 md:py-0">
          {/* Mobile Banners Above Exclusive Deals */}
          <div className="md:hidden mb-4">
            <div className="relative overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentBanner * 100}%)` }}
              >
                <div className="flex-shrink-0 w-full">
                  <img
                    src="/new.gif"
                    alt="New Banner 1"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="flex-shrink-0 w-full">
                  <img
                    src="/new1.jpeg"
                    alt="New Banner 2"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-2">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentBanner ? "bg-[#002579] w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#6EC6FF] py-4 px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Exclusive Deals</h2>
          </div>
          <div className="bg-red-50 p-3 md:py-4 rounded-lg">
            <div className="w-full">
              {exclusiveProductsLoading ? <SkeletonLoader /> : <ScrollableProducts products={exclusiveProducts} />}
            </div>
          </div>
        </section>

        {/* Exclusive Premium Picks Section */}
        <section className="py-0 md:py-0">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600 mb-2 text-left">Exclusive Premium Picks</h2>
            <p className="text-base md:text-lg text-gray-600 text-left">Limited Time Picks</p>
          </div>
          <div className="bg-pink-50 p-3 md:py-4 rounded-lg">
            <div className="w-full">
              {premiumPicksLoading ? <SkeletonLoader /> : <ScrollableProducts products={premiumPicks} />}
            </div>
          </div>
        </section>

        {/* Latest Arrivals Section */}
        <section className="py-0 md:py-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-4 text-center">Discover the Latest Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            {latestArrivals.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                scroll={true}
                className="group bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-100 block"
              >
                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto object-contain hover:brightness-110 group-hover:scale-100 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#002579] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-[#002579] mt-2">AED {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Two Banners Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-0 md:py-2">
          <a href="/wellness" className="block overflow-hidden shadow-lg transition-all duration-300">
            <img 
              src="/bannr (1).jpg" 
              alt="Banner 1"
              className="w-full h-auto object-cover transition-all duration-300 hover:brightness-110"
            />
          </a>
          <a href="/skincare" className="block overflow-hidden shadow-lg transition-all duration-300">
            <img 
              src="/bannr (2).jpg" 
              alt="Banner 2"
              className="w-full h-auto object-cover transition-all duration-300 hover:brightness-110"
            />
          </a>
                </section>

        {/* Trending Products Section */}
        <section className="py-0 md:py-0">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Trending Products</h2>
            <a href="/trending" className="text-[#002579] font-semibold hover:text-[#001845] flex items-center gap-2">
              View All <Icons.ArrowRight className="w-5 h-5" />
            </a>
          </div>
          <div className="w-full">
            <ScrollableProducts products={trendingProducts} />
          </div>
        </section>

        {/* Book Your Health Package Section */}
        <section className="py-0 md:py-2 bg-yellow-50">
          <div className="container mx-auto px-2 sm:px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 mt-2 md:mb-8 text-center">Book Your Health Package</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
              <a href="#package1" className="block overflow-hidden shadow-lg transition-all duration-300">
                <img 
                  src="/PACKAGE (1).png" 
                  alt="Health Package 1"
                  className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
              </a>
              <a href="#package2" className="block overflow-hidden shadow-lg transition-all duration-300">
                <img 
                  src="/PACKAGE (2).png" 
                  alt="Health Package 2"
                  className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
              </a>
              <a href="#package3" className="block overflow-hidden shadow-lg transition-all duration-300">
                <img 
                  src="/PACKAGE (3).png" 
                  alt="Health Package 3"
                  className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
              </a>
              <a href="#package4" className="block overflow-hidden shadow-lg transition-all duration-300">
                <img 
                  src="/PACKAGE (4).png" 
                  alt="Health Package 4"
                  className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
              </a>
              <a href="#package5" className="block overflow-hidden shadow-lg transition-all duration-300">
                <img 
                  src="/PACKAGE (5).png" 
                  alt="Health Package 5"
                  className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
              </a>
              <a href="#package6" className="block overflow-hidden shadow-lg transition-all duration-300">
                <img 
                  src="/PACKAGE (6).png" 
                  alt="Health Package 6"
                  className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110 hover:scale-100"
                />
              </a>
            </div>
          </div>
        </section>

        {/* WhatsApp Banner - Mobile Only */}
        <section className="md:hidden px-2 py-0">
          <div className="overflow-hidden rounded-[5] ">
            <img 
              src="/whatsapp banner smart care.png" 
              alt="WhatsApp Banner"
              className="w-full h-auto object-contain block"
            />
          </div>
        </section>

        {/* Mega Banner Section */}
        {/* <section className="py-0">
          <img 
            src="/mega banner.png" 
            alt="Mega Banner"
            className="w-full h-auto object-contain"
          />
        </section> */}

        {/* Search & Quick Actions Section */}
        <section className="py-0 md:py-0 bg-gray-50">
          <div className="container mx-auto px-2 sm:px-4">
            {/* Search Bar */}
            <div className="mb-4 md:mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, categories, or health packages..."
                  className="w-full px-6 py-4 pr-12 rounded-lg border-2 border-gray-300 focus:border-[#002579] focus:outline-none text-gray-700 placeholder-gray-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#002579] rounded-lg flex items-center justify-center hover:bg-[#001845] transition-colors">
                  <Icons.Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Button Images */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
              <a href="/products?category=fish-oils" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/Buttons-01.png" 
                  alt="Fish Oils"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=collagen" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/b2-01.png" 
                  alt="Collagen"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=face-sunscreen" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt3-01.png" 
                  alt="Face Sunscreen"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=vitamin-c" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt 4-01.png" 
                  alt="Vitamin C"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=creatine" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt 5-01.png" 
                  alt="Creatine"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=bp-monitors" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt 6-01.png" 
                  alt="BP Monitors"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=baby%20food%20%20%20nutrition" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt 7-01.png" 
                  alt="Baby Food & Nutrition"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=protein" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt 8-01.png" 
                  alt="Protein"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=multivitamin" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt 9-01.png" 
                  alt="Multivitamin"
                  className="w-full h-auto object-contain"
                />
              </a>
              <a href="/products?category=beauty%20supplements" className="block transition-all duration-300 hover:scale-105 cursor-pointer">
                <img 
                  src="/bt 10-01.png" 
                  alt="Beauty Supplements"
                  className="w-full h-auto object-contain"
                />
              </a>
            </div>
          </div>
        </section>

        {/* Three Button Images - Mobile Only */}
        <section className="md:hidden px-0 py-0">
          <div className="flex gap-2">
            <a href="#" className="flex-1 overflow-hidden rounded-[10px]">
              <img 
                src="/btnabv (1).png" 
                alt="Button 1"
                className="w-full h-auto object-contain block"
              />
            </a>
            <a href="#" className="flex-1 overflow-hidden rounded-[10px]">
              <img 
                src="/btnabv (2).png" 
                alt="Button 2"
                className="w-full h-auto object-contain block"
              />
            </a>
            <a href="#" className="flex-1 overflow-hidden rounded-[10px]">
              <img 
                src="/btnabv (3).png" 
                alt="Button 3"
                className="w-full h-auto object-contain block"
              />
            </a>
          </div>
        </section>

        {/* Self Medication Section */}
        <section className="py-0 pt-0 md:py-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center">Self Medication</h2>
          <div className="md:hidden">
            <div className="grid grid-cols-4 gap-2">
              {selfMedicationCategories.map((category, index) => (
                <a
                  key={index}
                  href={category.link}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-1 transition-all duration-300 group-hover:scale-105 p-1">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-110"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <ScrollableCategories categories={selfMedicationCategories} />
          </div>
        </section>

        {/* Explore Our Brand Store Section */}
        <section className="pb-4 md:py-0 bg-transparent">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center">Explore Our Brand Store</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            <a href="#brand1" className="block transition-all duration-300 hover:scale-100 cursor-pointer overflow-hidden rounded-lg">
              <img 
                src="/brnd2 (1).png" 
                alt="Brand 1"
                className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110"
              />
            </a>
            <a href="#brand2" className="block transition-all duration-300 hover:scale-100 cursor-pointer overflow-hidden rounded-lg">
              <img 
                src="/brnd2 (2).png" 
                alt="Brand 2"
                className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110"
              />
            </a>
            <a href="#brand3" className="block transition-all duration-300 hover:scale-100 cursor-pointer overflow-hidden rounded-lg">
              <img 
                src="/brnd2 (3).png" 
                alt="Brand 3"
                className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110"
              />
            </a>
            <a href="#brand4" className="block transition-all duration-300 hover:scale-100 cursor-pointer overflow-hidden rounded-lg">
              <img 
                src="/brnd2 (4).png" 
                alt="Brand 4"
                className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110"
              />
            </a>
            <a href="#brand5" className="block transition-all duration-300 hover:scale-100 cursor-pointer overflow-hidden rounded-lg">
              <img 
                src="/brnd2 (5).png" 
                alt="Brand 5"
                className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110"
              />
            </a>
            <a href="#brand6" className="block transition-all duration-300 hover:scale-100 cursor-pointer overflow-hidden rounded-lg">
              <img 
                src="/brnd2 (6).png" 
                alt="Brand 6"
                className="w-full h-auto object-contain transition-all duration-300 hover:brightness-110"
              />
            </a>
          </div>
        </section>

        {/* Baby Food Section */}
        <section className="py-4 md:py-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-8">Baby Food & Nutrition</h2>
          <a href="/baby-food" className="block rounded-2xl overflow-hidden shadow-lg transition-all duration-300 mb-4 mx-2  md:mb-8">
            <img 
              src="/BABY FOOD.png"
              alt="Baby Food"
              className="w-full h-auto object-cover px-0 transition-all duration-300 hover:brightness-110"
            />
          </a>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
            {babyFoodCategories.map((category, index) => (
              <a
                key={index}
                href={category.link}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-2 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-100 p-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-110"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#002579] transition-colors">
                  {category.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Care for Parents & Elders Section */}
        <section className="py-0 max-w-full">
          <div className="mb-0">
            <img 
              src="/Mobile view banner.png" 
              alt="Care for Parents & Elders"
              className="block md:hidden w-full h-auto object-contain hover:brightness-110 transition-all duration-300"
            />
            <img 
              src="/love banner (2).png" 
              alt="Care for Parents & Elders"
              className="hidden md:block w-full h-auto object-contain hover:brightness-110 transition-all duration-300"
            />
          </div>
          <div className="bg-[#daaa99] py-3 md:py-4 rounded-0  transition-all duration-300">
            <div className="max-w-full pl-2 md:mx-6 lg:mx-2 lg:-pl-6 ">
              <ScrollableProducts products={elderlyCareProducts} />
            </div>
          </div>
        </section>

        {/* Two Banners - Mobile View */}
        <section className="md:hidden px-0 pt-4 space-y-0">
          <div className="overflow-hidden rounded-[10px]">
            <img 
              src="/banners - mobile view.png" 
              alt="Mobile Banner"
              className="w-full h-auto object-contain block"
            />
          </div>
          <div className="overflow-hidden rounded-[10px]">
            <img 
              src="/Have a Prescription.png" 
              alt="Have a Prescription"
              className="w-full h-auto object-contain block"
            />
          </div>
        </section>

        {/* Blogs Section */}
        <section className="py-0 md:py-0">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-8 text-center">Latest Health Tips & Articles</h2>
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/articles/${blog.slug}`}
                  className="flex-shrink-0 w-64 group block bg-white overflow-hidden hover:opacity-90 transition-opacity duration-300 rounded-lg shadow-sm"
                >
                  <div className="h-40 overflow-hidden bg-gray-100 mb-3 rounded-t-lg">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 mb-2">{blog.date}</p>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#002579] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{blog.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/articles/${blog.slug}`}
                className="group block bg-white overflow-hidden hover:opacity-90 transition-opacity duration-300"
              >
                <div className="h-68 overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">{blog.date}</p>
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#002579] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Searches Section */}
        <section className="py-4 md:py-0 bg-gray-50">
          <div className="container mx-auto px-2 sm:px-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-1 md:gap-2">
              <a href="/products?tag=vitamin-c" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Vitamin C
              </a>
              <a href="/products?tag=omega-3" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Omega 3
              </a>
              <a href="/products?tag=protein" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Protein Supplements
              </a>
              <a href="/products?tag=sunscreen" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Sunscreen
              </a>
              <a href="/products?tag=multivitamin" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Multivitamins
              </a>
              <a href="/products?tag=baby-food" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Baby Food
              </a>
              <a href="/products?tag=collagen" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Collagen
              </a>
              <a href="/products?tag=biotin" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Biotin
              </a>
              <a href="/products?tag=face-mask" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Face Masks
              </a>
              <a href="/products?tag=whey-protein" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Whey Protein
              </a>
              <a href="/products?tag=fish-oil" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Fish Oil
              </a>
              <a href="/products?tag=calcium" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Calcium
              </a>
              <a href="/products?tag=vitamin-d" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Vitamin D
              </a>
              <a href="/products?tag=zinc" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Zinc Supplements
              </a>
              <a href="/products?tag=iron" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Iron Supplements
              </a>
              <a href="/products?tag=face-wash" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Face Wash
              </a>
              <a href="/products?tag=moisturizer" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Moisturizer
              </a>
              <a href="/products?tag=shampoo" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Shampoo
              </a>
              <a href="/products?tag=hair-oil" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Hair Oil
              </a>
              <a href="/products?tag=body-lotion" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Body Lotion
              </a>
              <a href="/products?tag=hand-sanitizer" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Hand Sanitizer
              </a>
              <a href="/products?tag=thermometer" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Thermometer
              </a>
              <a href="/products?tag=bp-monitor" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                BP Monitor
              </a>
              <a href="/products?tag=glucometer" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Glucometer
              </a>
              <a href="/products?tag=baby-diapers" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Baby Diapers
              </a>
              <a href="/products?tag=baby-lotion" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Baby Lotion
              </a>
              <a href="/products?tag=pain-relief" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Pain Relief
              </a>
              <a href="/products?tag=first-aid" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                First Aid Kit
              </a>
              <a href="/products?tag=face-serum" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Face Serum
              </a>
              <a href="/products?tag=probiotics" className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200 hover:border-[#002579] hover:text-[#002579] transition-colors">
                Probiotics
              </a>
            </div>
          </div>
        </section>

        {/* About Our Brand Section */}
        <section className="py-8 md:py-0">
          <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">About Our Brand</h2>
            
            <div className="prose prose-sm md:prose-lg max-w-none text-gray-600 space-y-4 md:space-y-6">
              <p className="text-lg font-semibold text-[#002579]">
                Live Healthy with Smart Health Pharmacy – First Omni-Channel Pharmacy & Healthcare Retailer in Middle East.
              </p>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Heritage:</h3>
                <p>
                  Smart Health Pharmacy started its journey in 1996 with a strong impulse to provide state-of-the-art experience in healthcare retail. Starting with one store, Smart Health Pharmacy in UAE has 520+ retail outlets consisting of Pharmacies, Healthcare Hypermarkets, Health and Wellness stores catering to an average annual customer base of more than ten million walk-ins. Smart Health Pharmacy is also the number one Online pharmacy in UAE. Smart Health Pharmacy app and website are widely used by users across UAE for all their health, fitness & lifestyle needs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">USPs of Smart Health Pharmacy</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Smart Health Pharmacy Mobile App</h4>
                    <p className="text-sm">Available on Android and iOS App Store, Smart Health Pharmacy app is a one stop destination for everything from vitamins to beauty care to sports nutrition to baby care products.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Largest pharmacy network in UAE</h4>
                    <p className="text-sm">Available on Android and iOS App Store, Smart Health Pharmacy app is a one stop destination for everything from vitamins to beauty care to sports nutrition to baby care products.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Omni-channel Experience</h4>
                    <p className="text-sm">Smart Health Pharmacy has successfully connected the world of online and offline with its innovative omni-channel retail technologies. Users can now shop wherever they choose, be it at one of our retail stores, call, or on their mobile devices.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Widest range of products</h4>
                    <p className="text-sm">Shop from a wide range of vitamins, sports supplements, beauty care products, makeup, baby care products and more at Smart Health Pharmacy.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Top Brands</h4>
                    <p className="text-sm">Smart Health Pharmacy brings all the top brands in healthcare, fitness, beauty & more. Shop Sunshine Nutrition, Trister, Cetaphil, Bioderma, Mustela, Sebamed, Solgar, and other brands on Smart Health Pharmacy online.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Free Delivery</h4>
                    <p className="text-sm">Free delivery is available on Smart Health Pharmacy website and app on a large number of products.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">30 minutes delivery</h4>
                    <p className="text-sm">Shop on Smart Health Pharmacy app or website and get your products delivered in less than 30 minutes. Available on select range of products.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Easy Payment Options</h4>
                    <p className="text-sm">Shop using your credit or debit cards. Or add to your wallet and save big.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Achievements & Awards</h3>
                <p className="mb-4">At Smart Health Pharmacy, our journey of innovation, service, and growth has earned us some of the most prestigious accolades in the region:</p>
                
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li><strong>Most Admired E-commerce Company</strong> - IMAGES RetailME Awards, 2023</li>
                  <li><strong>Best Service Brand</strong> - Dubai Service Excellence Awards, 2023</li>
                  <li><strong>Best Retail Customer Service</strong> - DSF Innovation Awards, 2010</li>
                  <li><strong>Category Leader in Retail</strong> - RetailME Awards, 2011–2015</li>
                  <li><strong>Superbrands UAE</strong> - Awarded Consistently, 2011–2018</li>
                  <li><strong>DED Certified: UAE's Largest Pharmacy Network</strong> - 2021</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Wide Range of Products</h3>
                <p>
                  Smart Health Pharmacy boasts of the widest range of product categories sold in physical stores, website and app. Shop for everything from Vitamins, Sports Nutrition, Beauty Care, Baby Care, Medicines, Personal Care and Makeup. Get exclusive deals and save big when you shop on Smart Health app and website.
                </p>
              </div>

              
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <img 
                  src="/smart logo png no arabic.png" 
                  alt="Smart Pharmacy" 
                  className="h-16 md:h-20 w-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your trusted healthcare partner in UAE. Delivering quality medicines and health products to your doorstep.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#002579] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#002579] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#002579] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#002579] hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-600 hover:text-[#002579] transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-[#002579] transition-colors">Contact Us</a></li>
                <li><a href="/stores" className="text-gray-600 hover:text-[#002579] transition-colors">Store Locator</a></li>
                <li><a href="/careers" className="text-gray-600 hover:text-[#002579] transition-colors">Careers</a></li>
                <li><a href="/blog" className="text-gray-600 hover:text-[#002579] transition-colors">Health Blog</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/help" className="text-gray-600 hover:text-[#002579] transition-colors">Help Center</a></li>
                <li><a href="/track-order" className="text-gray-600 hover:text-[#002579] transition-colors">Track Order</a></li>
                <li><a href="/returns" className="text-gray-600 hover:text-[#002579] transition-colors">Returns & Refunds</a></li>
                <li><a href="/shipping" className="text-gray-600 hover:text-[#002579] transition-colors">Shipping Info</a></li>
                <li><a href="/faq" className="text-gray-600 hover:text-[#002579] transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Icons.Phone className="w-5 h-5 text-[#002579] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Call Us</p>
                    <p className="text-gray-600">+971 4 883 7270</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#002579] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-gray-600">+971 50 110 3416</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.MapPin className="w-5 h-5 text-[#002579] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Visit Us</p>
                    <p className="text-gray-600">Shop 7, Khansaheb Residence, Al Jaddaf, Dubai-UAE</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#002579] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Email Us</p>
                    <p className="text-gray-600">info@smarthealth.ae</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                © 2025 Smart Healthcare Clinic & Pharmacy.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="/privacy" className="text-gray-600 hover:text-[#002579] transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-600 hover:text-[#002579] transition-colors">Terms of Service</a>
                <a href="/cookies" className="text-gray-600 hover:text-[#002579] transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="flex gap-0 overflow-x-auto scrollbar-hide scroll-smooth pb-4 cursor-grab select-none">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex-shrink-0 md:min-w-[140px] md:max-w-[200px] min-w-[120px] max-w-[200px] p-2 animate-pulse">
          <div className="bg-gray-300 rounded-2xl shadow-lg border border-gray-100 aspect-square mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mt-2"></div>
        </div>
      ))}
    </div>
  );
}

// Scrollable Products Component
function ScrollableProducts({ products }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle mouse wheel scrolling
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY > 0 ? 100 : -100;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Handle mouse drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Icons.ChevronLeft className="w-6 h-6 text-[#002579]" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Icons.ChevronRight className="w-6 h-6 text-[#002579]" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth pb-4 cursor-grab select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {products.map((product) => (
          <div key={product._id || product.id} className="flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Scrollable Categories Component
function ScrollableCategories({ categories }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-scroll infinitely every 3 seconds
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const itemWidth = 176; // w-40 = 160px + gap-4 = 16px
        
        // Smoothly scroll by one item width
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
        
        // Check if we've scrolled past the midpoint (original items)
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          // Reset to beginning without animation after a delay
          setTimeout(() => {
            container.scrollTo({ left: 0, behavior: 'auto' });
          }, 500);
        }
      }
    }, 3000);

    return () => clearInterval(autoScroll);
  }, []);

  // Duplicate categories for infinite scroll effect
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Icons.ChevronLeft className="w-6 h-6 text-[#002579]" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Icons.ChevronRight className="w-6 h-6 text-[#002579]" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedCategories.map((category, index) => (
          <a
            key={index}
            href={category.link}
            className="flex-shrink-0 w-40 group"
          >
            <div className="overflow-hidden transition-all duration-300 group-hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-auto object-contain transition-all duration-300 group-hover:brightness-110"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// Mock Data
const exclusiveDealsProducts = [
  { id: 1, name: "Vitamin C Serum 30ml", price: 120, salePrice: 89, brand: "Nature's Bounty", rating: { average: 4.5, count: 128 }, stock: 15, images: ["/prod1.jpg"], slug: "vitamin-c-serum" },
  { id: 2, name: "Omega-3 Fish Oil Capsules", price: 85, salePrice: 65, brand: "Nordic Naturals", rating: { average: 4.8, count: 256 }, stock: 8, images: ["/prod2.jpg"], slug: "omega-3-fish-oil" },
  { id: 3, name: "Collagen Powder 300g", price: 160, salePrice: 120, brand: "Vital Proteins", rating: { average: 4.7, count: 189 }, stock: 12, images: ["/prod3.jpg"], slug: "collagen-powder" },
  { id: 4, name: "Multivitamin Tablets", price: 65, salePrice: 45, brand: "Centrum", rating: { average: 4.6, count: 412 }, stock: 20, images: ["/prod3-1.jpg"], slug: "multivitamin-tablets" },
  { id: 5, name: "Probiotic Supplements", price: 98, salePrice: 78, brand: "Garden of Life", rating: { average: 4.9, count: 324 }, stock: 5, images: ["/prod3-2.jpg"], slug: "probiotic-supplements" },
  { id: 6, name: "Biotin Hair Vitamins", price: 75, salePrice: 55, brand: "SugarBear", rating: { average: 4.4, count: 218 }, stock: 18, images: ["/prod3-3.jpg"], slug: "biotin-hair-vitamins" },
  { id: 7, name: "Glucosamine Joint Support", price: 125, salePrice: 95, brand: "Osteo Bi-Flex", rating: { average: 4.5, count: 167 }, stock: 10, images: ["/prod3-4.jpg"], slug: "glucosamine-joint-support" },
  { id: 8, name: "Magnesium Supplement", price: 58, salePrice: 42, brand: "NOW Foods", rating: { average: 4.7, count: 293 }, stock: 25, images: ["/prod3-5.jpg"], slug: "magnesium-supplement" },
  { id: 9, name: "Vitamin D3 Drops", price: 52, salePrice: 38.50, brand: "Thorne", rating: { average: 4.8, count: 341 }, stock: 30, images: ["/prod1.jpg"], slug: "vitamin-d3-drops" },
  { id: 10, name: "Turmeric Curcumin", price: 88, salePrice: 68, brand: "Gaia Herbs", rating: { average: 4.6, count: 198 }, stock: 14, images: ["/prod2.jpg"], slug: "turmeric-curcumin" },
];

const premiumPicksStatic = [
  { id: 23, name: "Premium Health Supplement", price: 199.99, salePrice: 159.99, brand: "Premium Brand", rating: { average: 4.9, count: 87 }, stock: 10, images: ["https://life-cdn.lifepharmacy.com/EcomApp/products/Ajas/137596-1.png"], slug: "premium-health-supplement" },
  { id: 24, name: "Elite Wellness Formula", price: 229.00, salePrice: 189.00, brand: "Elite Health", rating: { average: 4.8, count: 64 }, stock: 8, images: ["https://life-cdn.lifepharmacy.com/EcomApp/products/Anwar/139050-1.png"], slug: "elite-wellness-formula" },
  { id: 25, name: "Sunshine Hair Max", price: 185.00, salePrice: 145.00, brand: "Sunshine Nutrition", rating: { average: 4.7, count: 112 }, stock: 12, images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/Ajas/Sunshine-Hair-Max-700px.jpg"], slug: "sunshine-hair-max" },
];

const latestArrivals = [
  { id: 11, name: "Hyaluronic Acid Serum", price: 95.00, salePrice: 75.00, brand: "The Ordinary", rating: { average: 4.7, count: 432 }, stock: 22, image: ["articles (1).png"], slug: "hyaluronic-acid-serum" },
  { id: 12, name: "Retinol Night Cream", price: 125.00, salePrice: 95.00, brand: "CeraVe", rating: { average: 4.8, count: 387 }, stock: 15, image: ["/articles (2).png"], slug: "retinol-night-cream" },
  { id: 13, name: "Sunscreen SPF 50+", price: 72.00, salePrice: 55.00, brand: "La Roche-Posay", rating: { average: 4.9, count: 521 }, stock: 28, image: ["/articles (3).png"], slug: "sunscreen-spf-50" },
  { id: 14, name: "Niacinamide Serum", price: 88.00, salePrice: 68.00, brand: "Paula's Choice", rating: { average: 4.6, count: 276 }, stock: 19, image: ["/articles (4).png"], slug: "niacinamide-serum" },
  { id: 15, name: "Eye Cream", price: 105.00, salePrice: 82.00, brand: "Kiehl's", rating: { average: 4.5, count: 198 }, stock: 12, image: ["/articles (5).png"], slug: "eye-cream" },
  { id: 16, name: "Face Moisturizer", price: 92.00, salePrice: 72.00, brand: "Neutrogena", rating: { average: 4.7, count: 345 }, stock: 24, image: ["/articles (6).png"], slug: "face-moisturizer" },
];

const trendingProductsStatic = [
  { id: 17, name: "Dymatize Iso 100 5 Lb Chocolate", price: 235.00, salePrice: 185.00, brand: "Dymatize", rating: { average: 4.8, count: 156 }, stock: 8, images: ["/Dymatize Iso 100 5 Lb Chocolate.jpg"], slug: "dymatize-iso-100-chocolate" },
  { id: 18, name: "Ketoscience Ketogenic Meal Shake Natural Chocolate 14 Servings 539g", price: 178.00, salePrice: 145.00, brand: "KetoScience", rating: { average: 4.9, count: 203 }, stock: 35, images: ["/Ketoscience Ketogenic Meal Shake Natural Chocolate 14 Servings 539g (weight loss).jpg"], slug: "ketoscience-meal-shake" },
  { id: 19, name: "Radiant Platinum B-Complex 100 90 Tabs", price: 118.00, salePrice: 95.00, brand: "Radiant", rating: { average: 4.7, count: 142 }, stock: 18, images: ["/Radiant Platinum B- Complex 100 90 Tabs (Nutrition & Supplement).jpg"], slug: "radiant-b-complex" },
  { id: 20, name: "Braun Oral B Precision Flexisoft Replacement Brush Heads 2+1", price: 155.00, salePrice: 125.00, brand: "Braun", rating: { average: 4.6, count: 289 }, stock: 50, images: ["/Braun Oral B Precision Flexisoft Replacement Brush Heads 2+1.jpg"], slug: "braun-oral-b-brush-heads" },
  { id: 21, name: "Clear Cool Sport Menthol-Male 400 ml", price: 98.00, salePrice: 78.00, brand: "Clear", rating: { average: 4.5, count: 167 }, stock: 22, images: ["/Clear Cool Sport Menthol-Male 400 ml.jpg"], slug: "clear-cool-sport-menthol" },
  { id: 22, name: "Puressentiel Purifying Antibacterial Lotion Spray", price: 165.00, salePrice: 135.00, brand: "Puressentiel", rating: { average: 4.8, count: 234 }, stock: 42, images: ["/Puressentiel Purifying Antibacterial Lotion Spray Hands & Surfaces with 3 Essential Oils (ANTISEPTIC DISINFECTANT).jpg"], slug: "puressentiel-antibacterial-spray" },
];

const elderlyCareProductsStatic = [
  { id: 26, name: "Trister Digital Wrist Blood Pressure Monitor", price: 115.00, salePrice: 89.00, brand: "Trister", rating: { average: 4.6, count: 98 }, stock: 15, images: ["https://life-cdn.lifepharmacy.com/archieved-images/media/catalog/product/t/r/trister-digital-wrist-blood-pressure-monitor.jpg"], slug: "trister-blood-pressure-monitor" },
  { id: 27, name: "Adult Care Essentials", price: 155.00, salePrice: 125.00, brand: "Health Care", rating: { average: 4.7, count: 76 }, stock: 20, images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/Ajas/108462-6.png"], slug: "adult-care-essentials" },
  { id: 28, name: "Elderly Support Product", price: 122.00, salePrice: 95.00, brand: "Care Plus", rating: { average: 4.5, count: 54 }, stock: 18, images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/aNwar%201/126931--1.png"], slug: "elderly-support-product" },
  { id: 29, name: "BD Micro Fine Plus Pen Needles 4mm", price: 58.00, salePrice: 45.00, brand: "BD", rating: { average: 4.8, count: 134 }, stock: 30, images: ["https://life-cdn.lifepharmacy.com/archieved-images/media/catalog/product/1/0/108463-bd_micro_fine_plus_pen_needles_4mm_1.jpg"], slug: "bd-pen-needles" },
  { id: 30, name: "Health Monitoring Device", price: 195.00, salePrice: 155.00, brand: "MediCare", rating: { average: 4.6, count: 87 }, stock: 12, images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/129573-01.jpg"], slug: "health-monitoring-device" },
  { id: 31, name: "Senior Care Product", price: 98.00, salePrice: 78.00, brand: "Care Expert", rating: { average: 4.7, count: 112 }, stock: 22, images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/aNwar%201/141321-01.png"], slug: "senior-care-product" },
];

const selfMedicationCategories = [
  { name: "Pain Relief", image: "/self (1).png", link: "/self-medication/pain-relief" },
  { name: "Cold & Flu", image: "/self (2).png", link: "/self-medication/cold-flu" },
  { name: "Digestive Health", image: "/self (3).png", link: "/self-medication/digestive" },
  { name: "Allergy Relief", image: "/self (4).png", link: "/self-medication/allergy" },
  { name: "Sleep Aid", image: "/self (5).png", link: "/self-medication/sleep" },
  { name: "First Aid", image: "/self (6).png", link: "/self-medication/first-aid" },
  { name: "Vitamins", image: "/self (7).png", link: "/self-medication/vitamins" },
  { name: "Supplements", image: "/self (8).png", link: "/self-medication/supplements" },
];

const babyFoodCategories = [
  { name: "Infant Formula", image: "/babyf (1).png", link: "/baby-food/formula" },
  { name: "Baby Cereals", image: "/babyf (2).png", link: "/baby-food/cereals" },
  { name: "Purees", image: "/babyf (3).png", link: "/baby-food/purees" },
  { name: "Snacks", image: "/babyf (4).png", link: "/baby-food/snacks" },
  { name: "Drinks", image: "/babyf (5).png", link: "/baby-food/drinks" },
  { name: "Organic Options", image: "/babyf (6).png", link: "/baby-food/organic" },
];

const blogs = [
  {
    id: 1,
    slug: "advanced-aesthetic-treatments-dubai",
    title: "Transform Your Confidence with Advanced Aesthetic Treatments in Al Jaddaf, Dubai",
    excerpt: "At Smart Health Medical Center, we redefine beauty and wellness through state-of-the-art aesthetic treatments designed to rejuvenate your skin, enhance your appearance, and restore your natural glow.",
    image: "/blg (1).jpeg",
    date: "November 16, 2025"
  },
  {
    id: 2,
    slug: "laser-treatments-guide-dubai",
    title: "The Ultimate Guide to Laser Treatments: Benefits, Types, and Results",
    excerpt: "Welcome to Smart Health Medical Center, your trusted destination for advanced laser treatments in Al Jaddaf, Dubai. Our clinic offers cutting-edge technology for flawless, radiant skin.",
    image: "/blg (2).jpeg",
    date: "November 16, 2025"
  },
  {
    id: 3,
    slug: "advanced-physiotherapy-techniques-dubai",
    title: "Heal Naturally with Our Advanced Physiotherapy Techniques",
    excerpt: "At Smart Healthcare Polyclinic, we specialize in advanced physiotherapy treatments in Al Jaddaf, Dubai, designed to help you recover, rebuild, and regain your quality of life.",
    image: "/blg (3).jpeg",
    date: "November 16, 2025"
  },
  {
    id: 4,
    slug: "complete-dental-treatments-dubai",
    title: "Complete Dental Treatments for a Perfect Smile",
    excerpt: "A beautiful smile is more than just appearance — it reflects confidence, health, and well-being. At Smart Healthcare Polyclinic, we offer advanced dental treatments for a bright, healthy smile.",
    image: "/blg (4).jpeg",
    date: "November 16, 2025"
  },
];
