/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Production Optimizations */
  reactStrictMode: true,
  
  // Optimize images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
