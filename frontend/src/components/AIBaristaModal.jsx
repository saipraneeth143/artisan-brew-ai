import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Plus,
  Check,
  RefreshCw,
  Coffee,
  Utensils,
} from 'lucide-react';
import { aiApi } from '../services/api';
import { useCart } from '../context/CartContext';

const MOOD_OPTIONS = [
  'Need Intense Focus',
  'Relaxed Morning',
  'Post-Workout Refresh',
  'Sweet Indulgence',
];

const FLAVOR_OPTIONS = [
  'Nutty & Chocolatey',
  'Fruity & Floral',
  'Spiced & Warm',
  'Creamy & Vanilla',
];

const DIETARY_OPTIONS = [
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Nut-Free',
];

const TEMPERATURE_OPTIONS = ['Hot', 'Iced', 'Blended', 'No Preference'];

const PAIRING_OPTIONS = [
  'Yes - Sweet Pastry',
  'Yes - Savory Dish',
  'Beverage Only',
];

export const AIBaristaWizard = ({ isModal = false, onClose }) => {
  const { addItem, setDrawerOpen } = useCart();

  const [mood, setMood] = useState('Need Intense Focus');
  const [flavorPreference, setFlavorPreference] = useState('Nutty & Chocolatey');
  const [dietaryTags, setDietaryTags] = useState([]);
  const [temperature, setTemperature] = useState('Hot');
  const [foodPairingChoice, setFoodPairingChoice] = useState('Yes - Sweet Pastry');
  const [roastProfile, setRoastProfile] = useState('Medium');
  const [milkOption, setMilkOption] = useState('Oat Milk');
  const [freeformNotes, setFreeformNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [addedIds, setAddedIds] = useState({});

  const toggleDietaryTag = (tag) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        mood,
        flavorPreference,
        dietaryTags,
        temperature,
        wantsFoodPairing: foodPairingChoice !== 'Beverage Only',
        foodPairingType: foodPairingChoice,
        roastProfile,
        milkOption,
        freeformNotes: freeformNotes.trim() || undefined,
      };

      const data = await aiApi.recommend(payload);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Master Barista Antoine encountered an issue crafting your pairing. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPairingToCart = (pairing, idx) => {
    if (pairing.beverageItem) {
      addItem(pairing.beverageItem, 1, {
        milk: milkOption,
        temperature,
      });
    }
    if (pairing.foodItem) {
      addItem(pairing.foodItem, 1, { warmed: true });
    }
    setAddedIds((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [idx]: false }));
    }, 1800);
  };

  return (
    <div className="bg-white rounded-3xl border border-espresso-200 shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-espresso-950 via-espresso-900 to-[#3d261c] text-crema px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#d49b54]/20 border border-[#d49b54]/40 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#d49b54]" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#d49b54] font-bold">
              Groq AI Flavor Sommelier
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Master Barista Antoine’s Pairing Concierge
            </h2>
          </div>
        </div>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-crema hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8">
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Mood / Vibe */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-2.5">
                1. What is your current mood or vibe?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MOOD_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMood(option)}
                    className={`px-3.5 py-3 rounded-xl text-xs font-bold border text-left transition-all ${
                      mood === option
                        ? 'bg-espresso-900 text-crema border-espresso-900 shadow-sm'
                        : 'bg-espresso-50/60 text-espresso-800 border-espresso-200 hover:bg-espresso-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Flavor Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-2.5">
                2. Select your primary flavor architecture
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FLAVOR_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFlavorPreference(option)}
                    className={`px-3.5 py-3 rounded-xl text-xs font-bold border text-left transition-all ${
                      flavorPreference === option
                        ? 'bg-[#89553e] text-white border-[#89553e] shadow-sm'
                        : 'bg-espresso-50/60 text-espresso-800 border-espresso-200 hover:bg-espresso-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Beverage Temp & Food Pairing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-2.5">
                  3. Beverage Temperature
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPERATURE_OPTIONS.map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setTemperature(temp)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        temperature === temp
                          ? 'bg-espresso-900 text-crema border-espresso-900'
                          : 'bg-white text-espresso-800 border-espresso-200 hover:bg-espresso-50'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-2.5">
                  4. Culinary Pairing Preference
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PAIRING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFoodPairingChoice(opt)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold border text-left transition-all ${
                        foodPairingChoice === opt
                          ? 'bg-espresso-900 text-crema border-espresso-900'
                          : 'bg-white text-espresso-800 border-espresso-200 hover:bg-espresso-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Dietary Needs (Multi-select) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700 mb-2.5">
                5. Dietary Restrictions (Multi-Select)
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((tag) => {
                  const active = dietaryTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietaryTag(tag)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                        active
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-espresso-700 border-espresso-200 hover:border-espresso-400'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Roast & Milk Nuances + Freeform Note */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-espresso-100">
              <div>
                <label className="block text-xs font-semibold text-espresso-700 mb-1">
                  Roast Profile
                </label>
                <select
                  value={roastProfile}
                  onChange={(e) => setRoastProfile(e.target.value)}
                  className="w-full rounded-xl border border-espresso-200 px-3 py-2.5 text-xs font-medium bg-espresso-50/40"
                >
                  <option value="Light">Light & Bright</option>
                  <option value="Medium">Balanced Medium</option>
                  <option value="Dark">Rich Dark Roast</option>
                  <option value="Espresso Roast">Signature Espresso Roast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-700 mb-1">
                  Preferred Milk
                </label>
                <select
                  value={milkOption}
                  onChange={(e) => setMilkOption(e.target.value)}
                  className="w-full rounded-xl border border-espresso-200 px-3 py-2.5 text-xs font-medium bg-espresso-50/40"
                >
                  <option value="Oat Milk">Barista Oat Milk</option>
                  <option value="Whole Milk">Organic Whole Milk</option>
                  <option value="Almond Milk">Roasted Almond Milk</option>
                  <option value="Coconut Milk">Coconut Milk</option>
                  <option value="Dairy-Free">Black / No Milk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-700 mb-1">
                  Special Craving Note (Optional)
                </label>
                <input
                  type="text"
                  value={freeformNotes}
                  onChange={(e) => setFreeformNotes(e.target.value)}
                  placeholder="e.g., low sugar, extra foam..."
                  className="w-full rounded-xl border border-espresso-200 px-3 py-2 text-xs bg-espresso-50/40"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-espresso-900 text-crema font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-espresso-800 transition-all shadow-lg"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#d49b54]" />
                  Master Barista Antoine is curating your bespoke pairings...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#d49b54]" />
                  Generate Personalized AI Pairing
                </>
              )}
            </button>
          </form>
        ) : (
          /* AI Recommendation Results View */
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-espresso-50 border border-espresso-200 space-y-3">
              <p className="font-serif text-lg font-bold text-espresso-950">
                “{result.headline}”
              </p>

              {result.tastingNotes?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-espresso-600 mr-1">
                    Expected Palate Notes:
                  </span>
                  {result.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-espresso-200 text-xs font-semibold text-espresso-800"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Pairings Cards */}
            <div className="space-y-4">
              {(result.pairings || []).map((pairing, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-espresso-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-espresso-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#89553e]">
                      Pairing Recommendation #{idx + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {pairing.matchScore}% Palate Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Beverage Item */}
                    {pairing.beverageItem && (
                      <div className="flex items-center gap-3.5 p-3 rounded-xl bg-espresso-50/70 border border-espresso-200/70">
                        <img
                          src={
                            pairing.beverageItem.image_url ||
                            pairing.beverageItem.imageUrl
                          }
                          alt={pairing.beverageItem.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-espresso-600">
                            <Coffee className="w-3 h-3" /> Signature Beverage
                          </span>
                          <h4 className="font-serif font-bold text-sm text-espresso-950 truncate">
                            {pairing.beverageItem.name}
                          </h4>
                          <p className="text-xs font-bold text-[#89553e]">
                            ${Number(pairing.beverageItem.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Food Item */}
                    {pairing.foodItem ? (
                      <div className="flex items-center gap-3.5 p-3 rounded-xl bg-espresso-50/70 border border-espresso-200/70">
                        <img
                          src={
                            pairing.foodItem.image_url || pairing.foodItem.imageUrl
                          }
                          alt={pairing.foodItem.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-espresso-600">
                            <Utensils className="w-3 h-3" /> Culinary Pairing
                          </span>
                          <h4 className="font-serif font-bold text-sm text-espresso-950 truncate">
                            {pairing.foodItem.name}
                          </h4>
                          <p className="text-xs font-bold text-[#89553e]">
                            ${Number(pairing.foodItem.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-3 rounded-xl border border-dashed border-espresso-200 text-xs text-espresso-500 italic">
                        Pure single-origin beverage focus (No food pairing selected)
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-espresso-700 leading-relaxed bg-crema/60 p-3.5 rounded-xl border border-espresso-100">
                    <strong className="text-espresso-950">Antoine’s Rationale: </strong>
                    {pairing.pairingRationale}
                  </p>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleAddPairingToCart(pairing, idx)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        addedIds[idx]
                          ? 'bg-emerald-700 text-white'
                          : 'bg-espresso-900 text-crema hover:bg-espresso-800'
                      }`}
                    >
                      {addedIds[idx] ? (
                        <>
                          <Check className="w-4 h-4" />
                          Added Pairing to Cart
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Entire Pairing to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-espresso-200">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-espresso-300 text-xs font-bold text-espresso-800 hover:bg-espresso-100"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refine Taste Preferences
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  setDrawerOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d49b54] text-espresso-950 text-xs font-bold hover:bg-[#e0aa63]"
              >
                Review Cart & Dietary Audit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AIBaristaModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <AIBaristaWizard isModal onClose={onClose} />
      </div>
    </div>
  );
};

export default AIBaristaModal;

