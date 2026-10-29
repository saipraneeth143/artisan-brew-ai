import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ClipboardList, Sparkles } from 'lucide-react';
import OrderTrackerCard from '../components/OrderTrackerCard';
import { ordersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { isAuthenticated, loginAsDemoRole } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Unable to load your order history.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      loginAsDemoRole('CUSTOMER');
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loginAsDemoRole, fetchOrders]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-espresso-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#b58260]">
            Real-Time Roastery Fulfillment
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
            Live Order Tracker & History
          </h1>
          <p className="text-xs sm:text-sm text-espresso-700 mt-1">
            Watch your beverages and pastries progress from PENDING to PREPARING and
            READY at the counter.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-espresso-200 bg-white text-xs font-bold text-espresso-900 hover:bg-espresso-100 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
          {error}
        </div>
      )}

      {loading && orders.length === 0 ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-56 rounded-3xl bg-espresso-100/70 animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-espresso-200 p-12 text-center space-y-4">
          <ClipboardList className="w-10 h-10 text-[#b58260] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-espresso-950">
            No orders placed yet
          </h3>
          <p className="text-xs text-espresso-600 max-w-md mx-auto">
            Explore our artisanal menu or ask Master Barista Antoine for a custom
            pairing to place your first order.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/menu"
              className="px-5 py-2.5 rounded-xl bg-espresso-900 text-crema text-xs font-bold"
            >
              Browse Menu
            </Link>
            <Link
              to="/barista"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-espresso-300 text-espresso-900 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b58260]" />
              Ask AI Barista
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderTrackerCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

