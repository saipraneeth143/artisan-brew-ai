import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import AIDietaryAudit from './AIDietaryAudit';

const CartDrawer = () => {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    subtotal,
    estimatedCalories,
    aiAnalysis,
    isAnalyzing,
    analysisError,
    runAIDietaryAudit,
  } = useCart();

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 bg-espresso-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fbf8f5] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 bg-espresso-950 text-crema flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#d49b54]" />
              <h2 className="font-serif text-xl font-bold">Your Roastery Bag</h2>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-full bg-white/10 text-crema hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-espresso-100 text-espresso-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-espresso-900">
                    Your bag is currently empty
                  </h3>
                  <p className="text-xs text-espresso-600 max-w-xs mx-auto">
                    Explore our single-origin espressos or ask Master Barista
                    Antoine for a custom pairing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/menu');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso-900 text-crema text-xs font-bold"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.cartLineId}
                      className="p-3.5 rounded-2xl bg-white border border-espresso-200/80 flex gap-3.5 shadow-sm"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-bold text-sm text-espresso-950 truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartLineId)}
                            className="text-espresso-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.customizations &&
                          Object.keys(item.customizations).length > 0 && (
                            <p className="text-[11px] text-espresso-600 mt-0.5">
                              {Object.entries(item.customizations)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(' • ')}
                            </p>
                          )}

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="inline-flex items-center border border-espresso-200 rounded-lg bg-espresso-50">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.cartLineId, item.quantity - 1)
                              }
                              className="px-2.5 py-1 text-xs font-bold text-espresso-800 hover:bg-espresso-200 rounded-l-lg"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 text-xs font-bold text-espresso-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.cartLineId, item.quantity + 1)
                              }
                              className="px-2.5 py-1 text-xs font-bold text-espresso-800 hover:bg-espresso-200 rounded-r-lg"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-sm font-bold text-espresso-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Dietary Audit inside Drawer */}
                <AIDietaryAudit
                  analysis={aiAnalysis}
                  isLoading={isAnalyzing}
                  error={analysisError}
                  onTriggerAudit={runAIDietaryAudit}
                />
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-espresso-200 space-y-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-espresso-600">
                  <span>Estimated Energy</span>
                  <span>{estimatedCalories} kcal</span>
                </div>
                <div className="flex justify-between text-base font-bold text-espresso-950 pt-1">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={runAIDietaryAudit}
                  disabled={isAnalyzing}
                  className="py-3 px-3 rounded-xl border border-espresso-300 text-espresso-900 font-bold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-espresso-100"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#b58260]" />
                  {isAnalyzing ? 'Auditing...' : 'Analyze with AI'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="py-3 px-4 rounded-xl bg-espresso-900 text-crema font-bold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-espresso-800 shadow-md"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

