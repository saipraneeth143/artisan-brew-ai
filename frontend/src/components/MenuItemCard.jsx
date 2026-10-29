import React, { useState } from 'react';
import { Plus, Flame, Check, Eye, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CATEGORY_LABELS = {
  ESPRESSO_COFFEE: 'Espresso & Coffee',
  COLD_BREWS_NITRO: 'Cold Brew & Nitro',
  ARTISANAL_TEAS: 'Artisanal Tea',
  BAKERY_PASTRIES: 'French Bakery',
  SAVORY_BRUNCH: 'Savory Brunch',
};

const MILK_OPTIONS = [
  'Standard Preparation',
  'Oat Milk',
  'Almond Milk',
  'Coconut Milk',
  'Whole Milk',
];

const SWEETNESS_OPTIONS = ['Standard', 'Unsweetened', 'Subtle', 'Medium'];

const MenuItemCard = ({ item }) => {
  const { addItem } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedMilk, setSelectedMilk] = useState('Standard Preparation');
  const [selectedSweetness, setSelectedSweetness] = useState('Standard');

  const isBeverage = [
    'ESPRESSO_COFFEE',
    'COLD_BREWS_NITRO',
    'ARTISANAL_TEAS',
  ].includes(item.category);

  const dietaryTags = item.dietaryTags || item.dietary_tags || [];
  const flavorNotes = item.flavorNotes || item.flavor_notes || [];
  const imageUrl = item.imageUrl || item.image_url;
  const isAvailable = item.isAvailable ?? item.is_available ?? true;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addItem(item, 1, {});
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  const handleCustomAdd = () => {
    if (!isAvailable) return;
    const customizations = isBeverage
      ? {
          milk: selectedMilk,
          sweetness: selectedSweetness,
        }
      : { warmed: true };
    addItem(item, quantity, customizations);
    setModalOpen(false);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group bg-white rounded-2xl border border-espresso-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative h-52 overflow-hidden bg-espresso-100">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-espresso-950/80 backdrop-blur-sm text-crema text-[11px] font-semibold">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-espresso-900 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            title="Inspect Flavor Notes & Customize"
          >
            <Eye className="w-4 h-4" />
          </button>

          {!isAvailable && (
            <div className="absolute inset-0 bg-espresso-950/70 flex items-center justify-center">
              <span className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                Sold Out for Today
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-bold text-espresso-950 leading-snug group-hover:text-[#89553e] transition-colors">
                {item.name}
              </h3>
              <span className="text-base font-bold text-espresso-900 shrink-0">
                ${Number(item.price).toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-espresso-700 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            {/* Flavor Notes */}
            {flavorNotes.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {flavorNotes.slice(0, 3).map((note) => (
                  <span
                    key={note}
                    className="px-2 py-0.5 rounded-md bg-espresso-50 text-espresso-700 border border-espresso-200/70 text-[11px] font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}

            {/* Dietary Badges */}
            {dietaryTags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="pt-3 border-t border-espresso-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs text-espresso-600">
              {item.calories ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>{item.calories} kcal</span>
                </>
              ) : (
                <span>Artisanal Prep</span>
              )}
            </div>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleQuickAdd}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isAvailable
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : addedFeedback
                  ? 'bg-emerald-700 text-white'
                  : 'bg-espresso-900 text-crema hover:bg-espresso-800 shadow-sm'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Item Detail & Customization Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/60 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-espresso-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-60">
              <img
                src={imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-espresso-950/75 text-white hover:bg-espresso-950"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4">
                <span className="px-3 py-1 rounded-full bg-espresso-950/85 text-crema text-xs font-semibold">
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-espresso-950">
                    {item.name}
                  </h3>
                  {item.calories && (
                    <p className="text-xs text-espresso-600 mt-0.5">
                      Estimated {item.calories} Calories per serving
                    </p>
                  )}
                </div>
                <span className="text-xl font-bold text-espresso-900">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-espresso-700 leading-relaxed">
                {item.description}
              </p>

              {/* Tasting & Dietary Chips */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-espresso-500">
                  Tasting Profile & Dietary Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-1 rounded-lg bg-espresso-50 text-espresso-800 border border-espresso-200 text-xs font-medium"
                    >
                      <Sparkles className="w-3 h-3 inline mr-1 text-[#b58260]" />
                      {note}
                    </span>
                  ))}
                  {dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Beverage Customizations */}
              {isBeverage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-espresso-100">
                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1">
                      Milk Selection
                    </label>
                    <select
                      value={selectedMilk}
                      onChange={(e) => setSelectedMilk(e.target.value)}
                      className="w-full rounded-xl border border-espresso-200 px-3 py-2 text-xs font-medium bg-espresso-50/50 focus:outline-none focus:ring-2 focus:ring-espresso-800"
                    >
                      {MILK_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1">
                      Sweetness Level
                    </label>
                    <select
                      value={selectedSweetness}
                      onChange={(e) => setSelectedSweetness(e.target.value)}
                      className="w-full rounded-xl border border-espresso-200 px-3 py-2 text-xs font-medium bg-espresso-50/50 focus:outline-none focus:ring-2 focus:ring-espresso-800"
                    >
                      {SWEETNESS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Quantity & Add Action */}
              <div className="pt-4 border-t border-espresso-100 flex items-center justify-between gap-4">
                <div className="flex items-center border border-espresso-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-sm font-bold text-espresso-800 hover:bg-espresso-100 rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-espresso-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-sm font-bold text-espresso-800 hover:bg-espresso-100 rounded-r-xl"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={handleCustomAdd}
                  className="flex-1 py-3 px-5 rounded-xl bg-espresso-900 text-crema font-bold text-xs uppercase tracking-wider hover:bg-espresso-800 transition-colors shadow-md"
                >
                  Add {quantity} to Order • ${(Number(item.price) * quantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;

