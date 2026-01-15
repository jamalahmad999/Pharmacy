"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/Icons";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('admin_token');
      console.log('Fetching orders from:', `${apiUrl}/api/orders`);
      
      const response = await fetch(`${apiUrl}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Orders data:', data);
      
      // Handle different response formats
      let ordersData = [];
      if (Array.isArray(data)) {
        ordersData = data;
      } else if (data.data && Array.isArray(data.data)) {
        ordersData = data.data;
      } else if (data.orders && Array.isArray(data.orders)) {
        ordersData = data.orders;
      }
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Icons.Loader className="w-8 h-8 text-[#002579] animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <p className="text-gray-600 mt-1">View and manage customer orders</p>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">Order #{order.orderNumber || order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                  order.orderStatus === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="font-semibold">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo?.email}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                  <p className="text-sm">{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && <p className="text-sm">{order.shippingAddress?.addressLine2}</p>}
                  <p className="text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.emirate}</p>
                  <p className="text-sm">{order.shippingAddress?.country}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <p className="font-semibold text-[#002579] text-xl">AED {order.total?.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 capitalize">{order.paymentMethod}</p>
                  <p className="text-xs text-gray-500 capitalize">Status: {order.paymentStatus}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Items ({order.items?.length || 0})</p>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity} × AED {item.price?.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold">AED {(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>AED {order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>AED {order.tax?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>AED {order.shipping?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-[#002579]">AED {order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {order.orderNotes && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Order Notes:</p>
                    <p className="text-sm text-gray-700">{order.orderNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
