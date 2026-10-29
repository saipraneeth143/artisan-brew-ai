import React, { useEffect, useState, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import MenuCategoryFilter from '../components/MenuCategoryFilter';
import DietaryFilterBar from '../components/DietaryFilterBar';
import MenuItemCard from '../components/MenuItemCard';
import { menuApi } from '../services/api';

const MenuPage = ({ onOpenBaristaModal }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const data = await menuApi.getAll();
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleToggleDietaryTag = (tag) => {
    setSelectedDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }

      const itemTags = item.dietaryTags || item.dietary_tags || [];
      if (
        selectedDietaryTags.length > 0 &&
        !selectedDietaryTags.every((t) => itemTags.includes(t))
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const notesMatch = (item.flavorNotes || item.flavor_notes || []).some(
          (n) => n.toLowerCase().includes(q)
        );
        return nameMatch || descMatch || notesMatch;
      }

      return true;
    });
  }, [menuItems, activeCategory, selectedDietaryTags, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-espresso-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#b58260]">
            Artisanal Roastery & Bakery Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
            Crafted Beverages & Viennoiserie
          </h1>
          <p className="text-xs sm:text-sm text-espresso-700 mt-1 max-w-2xl">
            Filter by roast category, tasting notes, or strict dietary tags—or ask
            Master Barista Antoine to pair your ideal order.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBaristaModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-espresso-900 text-crema text-xs font-bold hover:bg-espresso-800 transition-colors shrink-0 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#d49b54]" />
          Launch AI Pairing Wizard
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 bg-white p-5 rounded-3xl border border-espresso-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search espresso, matcha, yuzu, croissant, flavor notes..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-espresso-200 text-xs font-medium bg-espresso-50/50 focus:outline-none focus:ring-2 focus:ring-espresso-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dietary Filter Pills */}
          <DietaryFilterBar
            selectedTags={selectedDietaryTags}
            onToggleTag={handleToggleDietaryTag}
            onClearTags={() => setSelectedDietaryTags([])}
          />
        </div>

        {/* Category Tabs */}
        <div className="pt-2 border-t border-espresso-100">
          <MenuCategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-espresso-600">
        <span>
          Showing <strong className="text-espresso-950">{filteredItems.length}</strong>{' '}
          artisanal creations
        </span>
        {(activeCategory !== 'ALL' ||
          selectedDietaryTags.length > 0 ||
          searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory('ALL');
              setSelectedDietaryTags([]);
              setSearchQuery('');
            }}
            className="underline font-semibold text-espresso-800 hover:text-espresso-950"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-espresso-100/70 animate-pulse"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-espresso-200 p-12 text-center space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-[#b58260] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-espresso-950">
            No menu items match those exact filters
          </h3>
          <p className="text-xs text-espresso-600 max-w-md mx-auto">
            Try relaxing one of your dietary tags or clearing your search query to
            discover more roastery offerings.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('ALL');
              setSelectedDietaryTags([]);
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-espresso-900 text-crema text-xs font-bold"
          >
            Show Full Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;

