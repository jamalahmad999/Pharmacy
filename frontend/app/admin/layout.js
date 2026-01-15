"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    if (pathname !== '/admin' && (!token || !user)) {
      router.push('/admin');
      return;
    }

    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin' && pathname !== '/admin') {
        router.push('/admin');
        return;
      }
      setAdminUser(userData);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin');
  };

  // Don't show sidebar on login page
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', icon: 'Home', path: '/admin/dashboard', color: 'text-blue-600' },
    { name: 'Products', icon: 'ShoppingBag', path: '/admin/products', color: 'text-green-600' },
    { name: 'Categories', icon: 'Grid', path: '/admin/categories', color: 'text-purple-600' },
    { name: 'Brands', icon: 'Tag', path: '/admin/brands', color: 'text-orange-600' },
    { name: 'Orders', icon: 'Package', path: '/admin/orders', color: 'text-red-600' },
    { name: 'Prescriptions', icon: 'FileText', path: '/admin/prescriptions', color: 'text-cyan-600' },
    { name: 'Users', icon: 'Users', path: '/admin/users', color: 'text-indigo-600' },
  ];

  const IconComponent = ({ name }) => {
    const Icon = Icons[name];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Hidden on mobile, toggle button visible */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 ${isSidebarOpen ? 'w-64' : 'lg:w-20 w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-14 md:h-16 border-b border-gray-200 flex items-center justify-between px-3 md:px-4">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <img src="/logo smart.png" alt="Logo" className="h-6 md:h-8 w-6 md:w-8" />
              <span className="font-bold text-gray-900 text-sm md:text-base">Admin Panel</span>
            </div>
          ) : (
            <img src="/logo smart.png" alt="Logo" className="h-6 md:h-8 w-6 md:w-8 mx-auto" />
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Icons.Menu className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#002579] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={isActive ? 'text-white' : item.color}>
                  <IconComponent name={item.icon} />
                </span>
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          {isSidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-[#002579] rounded-full flex items-center justify-center text-white font-bold">
                  {adminUser?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {adminUser?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{adminUser?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icons.LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icons.LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 md:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded"
          >
            <Icons.Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-base md:text-xl font-bold text-gray-900">
            {navItems.find(item => item.path === pathname)?.name || 'Admin Panel'}
          </h1>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs md:text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-3 md:p-6">
          {children}
        </div>
      </main>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
