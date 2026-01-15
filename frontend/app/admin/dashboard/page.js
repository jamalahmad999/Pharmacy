"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/Icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('admin_token');

      // Fetch products
      const productsRes = await fetch(`${apiUrl}/api/products`);
      const productsResponse = await productsRes.json();
      const productsData = Array.isArray(productsResponse) ? productsResponse : 
                          (productsResponse.data || productsResponse.products || []);

      // Fetch orders
      const ordersRes = await fetch(`${apiUrl}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersResponse = await ordersRes.json();
      const ordersData = Array.isArray(ordersResponse) ? ordersResponse :
                        (ordersResponse.data || ordersResponse.orders || []);

      // Fetch users
      const usersRes = await fetch(`${apiUrl}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersResponse = await usersRes.json();
      const usersData = Array.isArray(usersResponse) ? usersResponse :
                       (usersResponse.data || usersResponse.users || []);

      // Calculate stats - ensure arrays before using array methods
      const totalRevenue = Array.isArray(ordersData) 
        ? ordersData.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0) 
        : 0;
      
      const lowStock = Array.isArray(productsData) 
        ? productsData.filter(p => p.stock < 10) 
        : [];

      setStats({
        totalProducts: Array.isArray(productsData) ? productsData.length : 0,
        totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalRevenue,
        recentOrders: Array.isArray(ordersData) ? ordersData.slice(0, 5) : [],
        lowStockProducts: lowStock.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error stack:', error.stack);
      // Set empty stats on error
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: [],
        lowStockProducts: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: 'ShoppingBag',
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: 'Package',
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'Users',
      color: 'bg-purple-500',
      trend: '+23%'
    },
    {
      title: 'Total Revenue',
      value: `AED ${stats.totalRevenue.toFixed(2)}`,
      icon: 'CreditCard',
      color: 'bg-orange-500',
      trend: '+15%'
    },
  ];

  const IconComponent = ({ name }) => {
    const Icon = Icons[name];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader className="w-8 h-8 text-[#002579] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#002579] to-[#001845] rounded-xl p-4 md:p-6 text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-sm md:text-base text-blue-100">Manage your pharmacy's operations efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className={`${stat.color} p-2 md:p-3 rounded-lg text-white`}>
                <IconComponent name={stat.icon} />
              </div>
              <span className="text-green-600 text-xs md:text-sm font-semibold">{stat.trend}</span>
            </div>
            <h3 className="text-gray-600 text-xs md:text-sm mb-1">{stat.title}</h3>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Recent Orders</h3>
          <div className="space-y-2 md:space-y-3">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">Order #{order._id.slice(-6)}</p>
                    <p className="text-xs md:text-sm text-gray-600">{order.user?.name || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#002579] text-sm md:text-base">AED {order.totalAmount?.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">No orders yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Low Stock Alert</h3>
          <div className="space-y-2 md:space-y-3">
            {stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 md:gap-3">
                    <img
                      src={product.images?.[0] || '/placeholder-product.png'}
                      alt={product.name}
                      className="w-8 h-8 md:w-10 md:h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-xs md:text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-sm md:text-base">{product.stock} left</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">All products in stock</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="flex flex-col md:flex-row items-center gap-2 md:gap-3 p-3 md:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Icons.Plus className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <span className="font-semibold text-blue-900 text-xs md:text-base text-center md:text-left">Add Product</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/categories'}
            className="flex flex-col md:flex-row items-center gap-2 md:gap-3 p-3 md:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Icons.Grid className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            <span className="font-semibold text-purple-900 text-xs md:text-base text-center md:text-left">Add Category</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/brands'}
            className="flex flex-col md:flex-row items-center gap-2 md:gap-3 p-3 md:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <Icons.Tag className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            <span className="font-semibold text-orange-900 text-xs md:text-base text-center md:text-left">Add Brand</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="flex flex-col md:flex-row items-center gap-2 md:gap-3 p-3 md:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Icons.Package className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            <span className="font-semibold text-green-900 text-xs md:text-base text-center md:text-left">View Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
}
