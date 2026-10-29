import React from 'react';
import { Coffee, Snowflake, Leaf, Croissant, Utensils } from 'lucide-react';

export const MENU_CATEGORIES = [
  { id: 'ALL', label: 'All Creations', icon: Coffee },
  { id: 'ESPRESSO_COFFEE', label: 'Espresso & Coffee', icon: Coffee },
  { id: 'COLD_BREWS_NITRO', label: 'Cold Brews & Nitro', icon: Snowflake },
  { id: 'ARTISANAL_TEAS', label: 'Artisanal Teas', icon: Leaf },
  { id: 'BAKERY_PASTRIES', label: 'Bakery & Pastries', icon: Croissant },
  { id: 'SAVORY_BRUNCH', label: 'Savory Brunch', icon: Utensils },
];

const MenuCategoryFilter = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      {MENU_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-espresso-900 text-crema shadow-md'
                : 'bg-white text-espresso-800 border border-espresso-200 hover:bg-espresso-100'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? 'text-[#d49b54]' : 'text-espresso-500'
              }`}
            />
            {category.label}
          </button>
        );
      })}
    </div>
  );
};

export default MenuCategoryFilter;

