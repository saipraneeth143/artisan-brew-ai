import React from 'react';
import { Check, Filter } from 'lucide-react';

export const DIETARY_TAGS = [
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Nut-Free',
];

const DietaryFilterBar = ({
  selectedTags = [],
  onToggleTag,
  onClearTags,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-espresso-600 mr-1">
        <Filter className="w-3.5 h-3.5 text-[#b58260]" />
        Dietary Filters:
      </span>

      {DIETARY_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggleTag(tag)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              isSelected
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                : 'bg-white text-espresso-700 border-espresso-200 hover:border-espresso-400'
            }`}
          >
            {isSelected && <Check className="w-3 h-3" />}
            {tag}
          </button>
        );
      })}

      {selectedTags.length > 0 && (
        <button
          type="button"
          onClick={onClearTags}
          className="text-xs font-semibold text-espresso-600 hover:text-espresso-950 underline ml-1"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default DietaryFilterBar;

