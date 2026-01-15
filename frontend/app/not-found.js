"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#002579] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-block bg-[#002579] text-white px-8 py-3 rounded-lg hover:bg-[#001845] transition-colors font-medium"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
