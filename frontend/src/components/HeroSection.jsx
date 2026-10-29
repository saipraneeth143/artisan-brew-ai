import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Leaf } from 'lucide-react';

const HeroSection = ({ onOpenBaristaModal }) => {
  return (
    <section className="relative overflow-hidden bg-espresso-950 text-crema">
      {/* Background Image with Rich Gradient Overlay */}
      <div className="absolute inset-0 opacity-35">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=80"
          alt="Artisanal Espresso Pour"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/90 to-espresso-950/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d49b54]/15 border border-[#d49b54]/40 text-[#f1c27d] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Master Barista Antoine AI (Groq LPU)
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
              Where Micro-Lot Roasting Meets{' '}
              <span className="italic font-normal text-[#d49b54]">
                Algorithmic Flavor Craft.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-espresso-200 max-w-2xl leading-relaxed">
              Experience personalized single-origin espresso, ceremonial teas, and
              72-hour laminated French viennoiserie matched to your exact palate,
              mood, and dietary blueprint in real time.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#d49b54] text-espresso-950 font-bold text-sm shadow-lg shadow-[#d49b54]/20 hover:bg-[#e0aa63] transition-all"
              >
                Explore Artisanal Menu
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenBaristaModal}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 backdrop-blur-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#d49b54]" />
                Ask AI Barista
              </button>
            </div>

            {/* Trust Pillars */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-xl">
              <div className="flex items-start gap-2.5">
                <Flame className="w-5 h-5 text-[#d49b54] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">98+ Score Lots</p>
                  <p className="text-[11px] text-espresso-300">Small-batch roasted daily</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Leaf className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Smart Dietary Audit</p>
                  <p className="text-[11px] text-espresso-300">Vegan, Keto & GF verified</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Live Order Pipeline</p>
                  <p className="text-[11px] text-espresso-300">Real-time bar tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Featured Interactive Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#d49b54] font-semibold">
                  AI Sommelier Preview
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  98% Flavor Synergy
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-espresso-900/90 border border-white/10 space-y-3">
                <p className="text-xs text-espresso-300 italic">
                  “I need intense afternoon focus, love floral & citrus notes, and
                  prefer dairy-free.”
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80"
                    alt="Sparkling Yuzu Cascara Espresso Tonic"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">
                      Sparkling Yuzu Cascara Tonic
                    </p>
                    <p className="text-xs text-[#d49b54]">
                      + Wild Maine Blueberry Scone (Vegan, GF)
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-espresso-200 leading-relaxed">
                Master Barista Antoine evaluates acidity, roast profile, body, and
                allergen constraints against our live roastery inventory.
              </p>

              <Link
                to="/barista"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-espresso-950 font-bold text-xs uppercase tracking-wider hover:bg-crema transition-colors"
              >
                Launch Full Interactive Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

