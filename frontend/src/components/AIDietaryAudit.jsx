import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Flame,
  HeartHandshake,
} from 'lucide-react';

const AIDietaryAudit = ({ analysis, isLoading, error, onTriggerAudit }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-espresso-200 bg-espresso-50/70 p-5 animate-pulse space-y-3">
        <div className="flex items-center gap-2 text-espresso-800 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-[#b58260] animate-spin" />
          Master Barista Antoine is auditing your cart’s nutritional & flavor synergy...
        </div>
        <div className="h-3 bg-espresso-200 rounded w-3/4" />
        <div className="h-3 bg-espresso-200 rounded w-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-center justify-between">
        <span>{error}</span>
        {onTriggerAudit && (
          <button
            type="button"
            onClick={onTriggerAudit}
            className="px-3 py-1.5 rounded-lg bg-red-700 text-white font-semibold"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="rounded-2xl border border-dashed border-espresso-300 bg-espresso-50/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-bold text-espresso-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#b58260]" />
            AI Smart Dietary & Flavor Harmony Audit
          </p>
          <p className="text-xs text-espresso-700">
            Let Master Barista Antoine inspect your cart for hidden allergens, total
            macros, and flavor compatibility.
          </p>
        </div>

        {onTriggerAudit && (
          <button
            type="button"
            onClick={onTriggerAudit}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso-900 text-crema text-xs font-bold hover:bg-espresso-800 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d49b54]" />
            Analyze Order with AI
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-espresso-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-espresso-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#b58260]" />
          <h4 className="font-serif text-base font-bold text-espresso-950">
            Antoine’s Culinary & Dietary Report
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
            Harmony: {analysis.harmonyScore}/100
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-espresso-100 text-espresso-900 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            {analysis.estimatedTotalCalories} kcal
          </span>
        </div>
      </div>

      {/* Compliance Banner */}
      <div
        className={`flex items-start gap-2.5 p-3 rounded-xl text-xs ${
          analysis.dietaryCompliance
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-amber-50 text-amber-900 border border-amber-200'
        }`}
      >
        {analysis.dietaryCompliance ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div>
          <p className="font-bold">
            {analysis.dietaryCompliance
              ? '100% Dietary Compliance Verified'
              : 'Dietary & Allergen Advisory Detected'}
          </p>
          {analysis.allergenWarnings?.length > 0 && (
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              {analysis.allergenWarnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Barista Customization Tips */}
      <div className="bg-espresso-50/80 rounded-xl p-3.5 border border-espresso-200/60">
        <p className="text-[11px] font-bold uppercase tracking-wider text-espresso-600 mb-1">
          Barista Customization Tip
        </p>
        <p className="text-xs text-espresso-900 leading-relaxed">
          {analysis.baristaTips}
        </p>
      </div>
    </div>
  );
};

export default AIDietaryAudit;

