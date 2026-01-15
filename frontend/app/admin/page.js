"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Check if user is admin
      if (data.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Store admin token and user info
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      // Redirect to admin products page
      router.push('/admin/products');
    } catch (error) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Admin Login</h1>
            <p className="text-sm md:text-base text-gray-600">Sign in to manage products</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 md:p-3 text-red-700 text-xs md:text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lifepharmacy.com"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 md:py-3 px-4 text-sm md:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 md:mt-6 text-center">
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <p className="text-xs font-semibold mb-1 md:mb-2 text-gray-600">Demo Credentials</p>
              <p className="text-xs text-gray-700">Email: admin@lifepharmacy.com</p>
              <p className="text-xs text-gray-700">Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}