import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck,
  ClipboardList,
  Coffee,
  BarChart3,
  RefreshCw,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { menuApi, ordersApi } from '../services/api';
import AdminOrderQueue from '../components/AdminOrderQueue';
import AdminMenuManager from '../components/AdminMenuManager';

const AdminPage = () => {
  const { isAdmin, loginAsDemoRole } = useAuth();
  const [activeTab, setActiveTab] = useState('ORDERS');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersData, menuData] = await Promise.all([
        ordersApi.getAllOrdersAdmin(),
        menuApi.getAll(),
      ]);
      setOrders(ordersData);
      setMenuItems(menuData);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin, loadDashboardData]);

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-espresso-950">
          Administrator Privileges Required
        </h1>
        <p className="text-xs sm:text-sm text-espresso-700">
          The Roastery Fulfillment & Catalog Management Portal is restricted to
          verified ADMIN staff accounts.
        </p>
        <button
          type="button"
          onClick={() => loginAsDemoRole('ADMIN')}
          className="px-6 py-3.5 rounded-xl bg-espresso-900 text-crema text-xs font-bold hover:bg-espresso-800 shadow-md"
        >
          Switch to Demo Admin Role Now
        </button>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    const updated = await ordersApi.updateStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  const handleCreateMenuItem = async (payload) => {
    const created = await menuApi.create(payload);
    setMenuItems((prev) => [...prev, created]);
  };

  const handleUpdateMenuItem = async (id, payload) => {
    const updated = await menuApi.update(id, payload);
    setMenuItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const handleDeleteMenuItem = async (id) => {
    await menuApi.remove(id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const activeOrdersCount = orders.filter((o) =>
    ['PENDING', 'PREPARING', 'READY'].includes(o.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-espresso-200 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">
            <ShieldCheck className="w-4 h-4" />
            Staff Command Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
            Roastery Operations & Menu Portal
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadDashboardData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-espresso-200 bg-white text-xs font-bold text-espresso-900 hover:bg-espresso-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Portal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-espresso-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-espresso-600">
              Active Kitchen Queue
            </p>
            <p className="font-serif text-3xl font-bold text-espresso-950 mt-1">
              {activeOrdersCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-espresso-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-espresso-600">
              Gross Order Revenue
            </p>
            <p className="font-serif text-3xl font-bold text-espresso-950 mt-1">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-espresso-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-espresso-600">
              Active Menu Creations
            </p>
            <p className="font-serif text-3xl font-bold text-espresso-950 mt-1">
              {menuItems.filter((i) => i.isAvailable ?? i.is_available).length} /{' '}
              {menuItems.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-espresso-100 text-espresso-900 flex items-center justify-center">
            <Coffee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-espresso-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('ORDERS')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ORDERS'
              ? 'bg-espresso-900 text-crema shadow-sm'
              : 'bg-white text-espresso-800 border border-espresso-200 hover:bg-espresso-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Live Order Queue ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MENU')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'MENU'
              ? 'bg-espresso-900 text-crema shadow-sm'
              : 'bg-white text-espresso-800 border border-espresso-200 hover:bg-espresso-100'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Menu Item CRUD ({menuItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ANALYTICS')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ANALYTICS'
              ? 'bg-espresso-900 text-crema shadow-sm'
              : 'bg-white text-espresso-800 border border-espresso-200 hover:bg-espresso-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          AI & Dietary Trends
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ORDERS' && (
        <AdminOrderQueue
          orders={orders}
          onUpdateStatus={handleUpdateOrderStatus}
          isLoading={loading}
        />
      )}

      {activeTab === 'MENU' && (
        <AdminMenuManager
          menuItems={menuItems}
          onCreateItem={handleCreateMenuItem}
          onUpdateItem={handleUpdateMenuItem}
          onDeleteItem={handleDeleteMenuItem}
        />
      )}

      {activeTab === 'ANALYTICS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-espresso-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-espresso-950 font-serif font-bold text-lg">
              <TrendingUp className="w-5 h-5 text-[#b58260]" />
              Dietary Tag Distribution Across Menu
            </div>
            <div className="space-y-3">
              {['Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Nut-Free'].map(
                (tag) => {
                  const count = menuItems.filter((i) =>
                    (i.dietaryTags || i.dietary_tags || []).includes(tag)
                  ).length;
                  const pct =
                    menuItems.length > 0
                      ? Math.round((count / menuItems.length) * 100)
                      : 0;
                  return (
                    <div key={tag} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-espresso-800">
                        <span>{tag}</span>
                        <span>
                          {count} items ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-espresso-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-espresso-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-espresso-950 font-serif font-bold text-lg">
              <CheckCircle2 className="w-5 h-5 text-[#b58260]" />
              Category Inventory Breakdown
            </div>
            <div className="space-y-3">
              {[
                'ESPRESSO_COFFEE',
                'COLD_BREWS_NITRO',
                'ARTISANAL_TEAS',
                'BAKERY_PASTRIES',
                'SAVORY_BRUNCH',
              ].map((cat) => {
                const count = menuItems.filter((i) => i.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-3 rounded-xl bg-espresso-50/70 text-xs font-bold text-espresso-900"
                  >
                    <span>{cat.replace(/_/g, ' ')}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-espresso-200">
                      {count} items
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

