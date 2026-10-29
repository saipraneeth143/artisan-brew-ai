import React from 'react';
import {
  Clock,
  Flame,
  CheckCircle2,
  PackageCheck,
  XCircle,
  Coffee,
} from 'lucide-react';

const STEPS = [
  { key: 'PENDING', label: 'Order Received', icon: Clock },
  { key: 'PREPARING', label: 'Barista Crafting', icon: Flame },
  { key: 'READY', label: 'Ready for Pickup', icon: PackageCheck },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
];

const STATUS_BADGE_STYLES = {
  PENDING: 'bg-amber-100 text-amber-900 border-amber-300',
  PREPARING: 'bg-sky-100 text-sky-900 border-sky-300',
  READY: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  COMPLETED: 'bg-espresso-100 text-espresso-900 border-espresso-300',
  CANCELLED: 'bg-red-100 text-red-900 border-red-300',
};

const OrderTrackerCard = ({ order }) => {
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="bg-white rounded-3xl border border-espresso-200 p-6 shadow-sm space-y-6">
      {/* Top Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-espresso-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-espresso-500">
              #{String(order.id).slice(0, 8).toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                STATUS_BADGE_STYLES[order.status] || STATUS_BADGE_STYLES.PENDING
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-espresso-600 mt-1">
            Placed on{' '}
            {new Date(order.created_at).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-espresso-500 block">
            Total Paid
          </span>
          <span className="font-serif text-xl font-bold text-espresso-950">
            ${Number(order.total_amount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Status Progress Bar */}
      {isCancelled ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-900 text-xs font-semibold">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          This order was cancelled. Please contact our roastery counter if you need
          assistance.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 pt-1">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all mb-2 ${
                    isCurrent
                      ? 'bg-[#b58260] text-white ring-4 ring-[#b58260]/25'
                      : isCompleted
                      ? 'bg-espresso-900 text-crema'
                      : 'bg-espresso-100 text-espresso-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isCompleted ? 'text-espresso-950' : 'text-espresso-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Line Items */}
      <div className="space-y-2.5 pt-2 border-t border-espresso-100">
        {(order.order_items || []).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 py-1.5 text-xs"
          >
            <div className="flex items-center gap-3">
              {item.menu_item?.image_url ? (
                <img
                  src={item.menu_item.image_url}
                  alt={item.menu_item.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-espresso-100 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-espresso-700" />
                </div>
              )}
              <div>
                <p className="font-bold text-espresso-950">
                  {item.quantity}x {item.menu_item?.name || 'Artisanal Item'}
                </p>
                {item.customizations &&
                  Object.keys(item.customizations).length > 0 && (
                    <p className="text-[11px] text-espresso-600">
                      {Object.entries(item.customizations)
                        .map(([k, v]) => `${k}: ${String(v)}`)
                        .join(' • ')}
                    </p>
                  )}
              </div>
            </div>

            <span className="font-bold text-espresso-900">
              ${(Number(item.unit_price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {order.special_instructions && (
        <div className="p-3 rounded-xl bg-espresso-50 text-xs text-espresso-800 border border-espresso-200/60">
          <strong className="font-semibold">Barista Note:</strong>{' '}
          {order.special_instructions}
        </div>
      )}
    </div>
  );
};

export default OrderTrackerCard;

