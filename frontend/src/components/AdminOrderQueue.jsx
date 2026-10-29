import React, { useState } from 'react';
import {
  Clock,
  Flame,
  PackageCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User,
} from 'lucide-react';

const STATUS_FLOW = {
  PENDING: 'PREPARING',
  PREPARING: 'READY',
  READY: 'COMPLETED',
};

const NEXT_ACTION_LABEL = {
  PENDING: 'Start Preparing',
  PREPARING: 'Mark Ready for Pickup',
  READY: 'Complete Hand-off',
};

const AdminOrderQueue = ({ orders = [], onUpdateStatus, isLoading }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredOrders =
    statusFilter === 'ALL'
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const handleTransition = async (orderId, nextStatus) => {
    setUpdatingId(orderId);
    try {
      await onUpdateStatus(orderId, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-espresso-900 text-crema shadow-sm'
                    : 'bg-white text-espresso-800 border border-espresso-200 hover:bg-espresso-100'
                }`}
              >
                {st} (
                {st === 'ALL'
                  ? orders.length
                  : orders.filter((o) => o.status === st).length}
                )
              </button>
            )
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm text-espresso-600">
          Syncing live kitchen order queue...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-espresso-200 p-12 text-center space-y-2">
          <p className="font-serif text-lg font-bold text-espresso-900">
            No orders in this queue stage
          </p>
          <p className="text-xs text-espresso-600">
            New customer orders appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredOrders.map((order) => {
            const nextStatus = STATUS_FLOW[order.status];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-espresso-200 p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-espresso-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-espresso-500">
                        ORDER #{String(order.id).slice(0, 8).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-espresso-950 mt-0.5">
                        <User className="w-4 h-4 text-[#b58260]" />
                        {order.profiles?.full_name || 'Walk-in Guest'}
                      </div>
                      <p className="text-[11px] text-espresso-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-espresso-100 text-espresso-900">
                        {order.status}
                      </span>
                      <p className="font-serif text-lg font-bold text-espresso-950 mt-1">
                        ${Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {(order.order_items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs bg-espresso-50/70 px-3 py-2 rounded-xl"
                      >
                        <div>
                          <span className="font-bold text-espresso-950">
                            {item.quantity}x{' '}
                            {item.menu_item?.name || 'Artisanal Item'}
                          </span>
                          {item.customizations &&
                            Object.keys(item.customizations).length > 0 && (
                              <span className="block text-[11px] text-espresso-600">
                                {Object.entries(item.customizations)
                                  .map(([k, v]) => `${k}: ${String(v)}`)
                                  .join(' • ')}
                              </span>
                            )}
                        </div>
                        <span className="font-semibold text-espresso-800">
                          ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.special_instructions && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong>Ticket Note:</strong> {order.special_instructions}
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div className="pt-3 border-t border-espresso-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {['PENDING', 'PREPARING', 'READY', 'COMPLETED'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={updatingId === order.id || order.status === st}
                        onClick={() => handleTransition(order.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          order.status === st
                            ? 'bg-espresso-900 text-white border-espresso-900'
                            : 'bg-white text-espresso-700 border-espresso-200 hover:bg-espresso-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status !== 'CANCELLED' &&
                      order.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => handleTransition(order.id, 'CANCELLED')}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}

                    {nextStatus && (
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handleTransition(order.id, nextStatus)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b58260] text-white text-xs font-bold hover:bg-[#a46b4c] shadow-sm"
                      >
                        {NEXT_ACTION_LABEL[order.status]}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrderQueue;

