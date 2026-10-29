import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';
import AIDietaryAudit from '../components/AIDietaryAudit';
import DietaryFilterBar from '../components/DietaryFilterBar';

const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    estimatedCalories,
    dietaryRestrictions,
    toggleDietaryRestriction,
    setDietaryRestrictions,
    aiAnalysis,
    isAnalyzing,
    analysisError,
    runAIDietaryAudit,
  } = useCart();

  const { isAuthenticated, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const taxAmount = Number((subtotal * 0.0825).toFixed(2));
  const finalTotal = Number((subtotal + taxAmount).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setPlacingOrder(true);
    setOrderError(null);

    try {
      if (!isAuthenticated) {
        // Automatically sign in as Demo Customer if placing order as guest
        loginAsDemoRole('CUSTOMER');
      }

      const payload = {
        items: items.map((item) => ({
          menuItemId: item.menuItemId || item.id,
          quantity: item.quantity,
          customizations: item.customizations || {},
        })),
        specialInstructions: specialInstructions.trim() || undefined,
      };

      await ordersApi.create(payload);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setOrderError(
        err.response?.data?.error ||
          'Unable to place your order. Please verify your items and try again.'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-espresso-100 text-espresso-700 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-espresso-950">
          Your Roastery Cart is Empty
        </h1>
        <p className="text-sm text-espresso-700 max-w-md mx-auto">
          Add single-origin espressos, nitro cold brews, or laminated pastries to
          run an AI dietary audit and place your order.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/menu"
            className="px-6 py-3 rounded-xl bg-espresso-900 text-crema text-xs font-bold hover:bg-espresso-800"
          >
            Explore Artisanal Menu
          </Link>
          <Link
            to="/barista"
            className="px-6 py-3 rounded-xl border border-espresso-300 text-espresso-900 text-xs font-bold hover:bg-espresso-100"
          >
            Ask AI Barista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#b58260]">
          Order Review & Smart Nutritional Audit
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
          Your Artisanal Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items & AI Audit */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dietary Profile Selector for Audit */}
          <div className="bg-white rounded-3xl border border-espresso-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-espresso-700">
                Select Your Dietary Profile for AI Cart Audit
              </p>
              <button
                type="button"
                onClick={runAIDietaryAudit}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#89553e] hover:text-espresso-950"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Re-run AI Audit
              </button>
            </div>
            <DietaryFilterBar
              selectedTags={dietaryRestrictions}
              onToggleTag={toggleDietaryRestriction}
              onClearTags={() => setDietaryRestrictions([])}
            />
          </div>

          {/* AI Dietary Audit Component */}
          <AIDietaryAudit
            analysis={aiAnalysis}
            isLoading={isAnalyzing}
            error={analysisError}
            onTriggerAudit={runAIDietaryAudit}
          />

          {/* Cart Items List */}
          <div className="bg-white rounded-3xl border border-espresso-200 divide-y divide-espresso-100 overflow-hidden shadow-sm">
            {items.map((item) => (
              <div
                key={item.cartLineId}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-espresso-950">
                      {item.name}
                    </h3>
                    {item.customizations &&
                      Object.keys(item.customizations).length > 0 && (
                        <p className="text-xs text-espresso-600">
                          {Object.entries(item.customizations)
                            .map(([k, v]) => `${k}: ${String(v)}`)
                            .join(' • ')}
                        </p>
                      )}
                    <div className="flex flex-wrap gap-1">
                      {(item.dietaryTags || []).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="inline-flex items-center border border-espresso-200 rounded-xl bg-espresso-50">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartLineId, item.quantity - 1)
                      }
                      className="px-3 py-1.5 text-xs font-bold text-espresso-800 hover:bg-espresso-200 rounded-l-xl"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-espresso-950">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartLineId, item.quantity + 1)
                      }
                      className="px-3 py-1.5 text-xs font-bold text-espresso-800 hover:bg-espresso-200 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-serif text-base font-bold text-espresso-950 min-w-[64px] text-right">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.cartLineId)}
                    className="p-2 text-espresso-400 hover:text-red-600"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Checkout Summary */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handlePlaceOrder}
            className="bg-white rounded-3xl border border-espresso-200 p-6 sm:p-8 shadow-md space-y-6 sticky top-28"
          >
            <h2 className="font-serif text-2xl font-bold text-espresso-950 border-b border-espresso-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-espresso-700">
                <span>Items Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-espresso-700">
                <span>Estimated Taxes (8.25%)</span>
                <span className="font-semibold">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-espresso-700">
                <span>Estimated Total Energy</span>
                <span className="font-semibold">{estimatedCalories} kcal</span>
              </div>
              <div className="flex justify-between text-base font-bold text-espresso-950 pt-3 border-t border-espresso-200">
                <span>Total Due</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso-800 mb-1.5">
                Special Barista Instructions (Optional)
              </label>
              <textarea
                rows={3}
                maxLength={300}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., Extra hot oat milk, light cinnamon dusting, pick up at counter..."
                className="w-full rounded-2xl border border-espresso-200 p-3 text-xs bg-espresso-50/40 focus:outline-none focus:ring-2 focus:ring-espresso-900"
              />
            </div>

            {orderError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                {orderError}
              </div>
            )}

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full py-4 rounded-2xl bg-espresso-900 text-crema font-bold text-sm flex items-center justify-center gap-2 hover:bg-espresso-800 transition-all shadow-lg"
            >
              {placingOrder ? (
                'Transmitting Order to Barista Queue...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#d49b54]" />
                  Place Order • ${finalTotal.toFixed(2)}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

