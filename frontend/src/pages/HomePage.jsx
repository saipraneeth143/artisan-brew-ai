import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Coffee,
  ShieldCheck,
  Award,
  HeartHandshake,
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import MenuItemCard from '../components/MenuItemCard';
import { menuApi } from '../services/api';

const HomePage = ({ onOpenBaristaModal }) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        const items = await menuApi.getAll({ availableOnly: 'true' });
        setFeaturedItems(items.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecials();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner */}
      <HeroSection onOpenBaristaModal={onOpenBaristaModal} />

      {/* Daily Roaster & Pastry Chef Specials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#b58260]">
              Curated Micro-Lots & Viennoiserie
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
              Today’s Roastery & Chef Specials
            </h2>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-espresso-900 hover:text-[#89553e]"
          >
            View Complete Menu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-espresso-100/70 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* AI Flavor Concierge Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-espresso-950 via-espresso-900 to-[#3d251a] text-crema p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d49b54]/20 text-[#f1c27d] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Palate Profiling
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Unsure Whether to Order a Washed Yirgacheffe or Ceremonial Uji Matcha?
            </h2>
            <p className="text-sm sm:text-base text-espresso-200 max-w-2xl leading-relaxed">
              Answer five quick sensory questions about your mood, preferred roast
              acidity, sweetness, and dietary needs. Master Barista Antoine will
              synthesize a tailored beverage & pastry pairing with match scores.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <button
              type="button"
              onClick={onOpenBaristaModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#d49b54] text-espresso-950 font-bold text-sm hover:bg-[#e0aa63] transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Consult AI Flavor Barista
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-espresso-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-espresso-100 text-espresso-900 flex items-center justify-center">
              <Award className="w-6 h-6 text-[#b58260]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-espresso-950">
              Direct-Trade Micro-Lot Roasting
            </h3>
            <p className="text-xs text-espresso-700 leading-relaxed">
              Every espresso and slow-drip cold brew is sourced from single-estate
              high-altitude farms in Ethiopia, Colombia, and Guatemala and roasted
              in small batches on our Loring smart roaster.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-espresso-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-espresso-100 text-espresso-900 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-[#b58260]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-espresso-950">
              AI Smart Dietary & Macro Audit
            </h3>
            <p className="text-xs text-espresso-700 leading-relaxed">
              Whether you follow a strict Vegan, Gluten-Free, Keto, or Nut-Free
              regimen, our real-time cart analyzer flags cross-allergens and
              suggests exact barista milk or pastry substitutions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-espresso-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-espresso-100 text-espresso-900 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#b58260]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-espresso-950">
              Live Barista Fulfillment Pipeline
            </h3>
            <p className="text-xs text-espresso-700 leading-relaxed">
              Track your order from the moment it enters our espresso queue through
              steaming, plating, and counter hand-off with live status badges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

