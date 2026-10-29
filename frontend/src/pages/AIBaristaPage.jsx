import React from 'react';
import { Sparkles, Coffee, ShieldCheck } from 'lucide-react';
import { AIBaristaWizard } from '../components/AIBaristaModal';

const AIBaristaPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-espresso-100 text-espresso-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#b58260]" />
          Interactive Flavor Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950">
          Meet Master Barista Antoine
        </h1>
        <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed">
          Powered by Groq LPU inference, Antoine analyzes acidity, body, sweetness,
          and allergen constraints across our active menu to craft your ideal
          coffee, tea, and pastry pairing.
        </p>
      </div>

      <AIBaristaWizard />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-white border border-espresso-200/80 flex items-start gap-3.5">
          <Coffee className="w-5 h-5 text-[#b58260] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-espresso-950">
              Zero Hallucinated Menu Items
            </h3>
            <p className="text-xs text-espresso-600 mt-0.5">
              Every recommendation is strictly grounded against our live PostgreSQL
              roastery catalog with verified item UUIDs and real-time stock status.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-espresso-200/80 flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-espresso-950">
              Strict Allergen & Dietary Guardrails
            </h3>
            <p className="text-xs text-espresso-600 mt-0.5">
              Selecting Vegan, Keto, Gluten-Free, or Nut-Free filters ensures
              compliant pairings and proactive milk customization advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBaristaPage;

