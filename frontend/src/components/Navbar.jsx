import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Coffee,
  Sparkles,
  ShoppingBag,
  ClipboardList,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenBaristaModal }) => {
  const { isAuthenticated, isAdmin, profile, signOut, loginAsDemoRole } = useAuth();
  const { totalItems, setDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'bg-espresso-900 text-crema'
        : 'text-espresso-800 hover:text-espresso-950 hover:bg-espresso-100'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-espresso-200/80 bg-[#fbf8f5]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-espresso-900 text-crema flex items-center justify-center shadow-md group-hover:bg-espresso-800 transition-colors">
            <Coffee className="w-6 h-6 text-[#d49b54]" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-espresso-950 block leading-none">
              Artisan Brew <span className="text-[#b58260]">AI</span>
            </span>
            <span className="text-[11px] uppercase tracking-widest text-espresso-600 font-medium">
              Roastery & Culinary Lab
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/menu" className={navLinkClass}>
            Artisanal Menu
          </NavLink>
          <NavLink to="/barista" className={navLinkClass}>
            AI Flavor Concierge
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            <span className="inline-flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" />
              Orders
            </span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5 text-amber-800 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Admin Portal
              </span>
            </NavLink>
          )}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* AI Barista Quick Trigger */}
          {onOpenBaristaModal && (
            <button
              type="button"
              onClick={onOpenBaristaModal}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2b1b14] to-[#4a2e21] text-crema text-xs font-semibold shadow-sm hover:opacity-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d49b54]" />
              Ask Antoine AI
            </button>
          )}

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-espresso-200 bg-white text-espresso-900 hover:bg-espresso-50 transition-colors shadow-sm"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="w-4 h-4 text-espresso-700" />
            <span className="text-xs font-semibold hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#b58260] text-white text-xs font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth Profile / Quick Role Switch */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-espresso-200">
              <div className="text-right">
                <p className="text-xs font-semibold text-espresso-900 leading-tight">
                  {profile?.full_name || 'Valued Guest'}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      isAdmin
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-espresso-100 text-espresso-700'
                    }`}
                  >
                    {profile?.role || 'CUSTOMER'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      loginAsDemoRole(isAdmin ? 'CUSTOMER' : 'ADMIN')
                    }
                    className="text-[10px] underline text-espresso-600 hover:text-espresso-900"
                    title="Switch demo role between Customer and Admin"
                  >
                    Switch to {isAdmin ? 'Customer' : 'Admin'}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 rounded-lg text-espresso-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-espresso-900 hover:bg-espresso-100 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => loginAsDemoRole('ADMIN')}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                title="Instant Demo Admin Login"
              >
                Demo Admin
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-espresso-800 hover:bg-espresso-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-espresso-200 bg-[#fbf8f5] px-4 pt-3 pb-5 space-y-2">
          <div className="flex flex-col space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Artisanal Menu
            </NavLink>
            <NavLink
              to="/barista"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              AI Flavor Concierge
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Cart & Dietary Audit
            </NavLink>
            <NavLink
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Order Tracker
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Admin Management Portal
              </NavLink>
            )}
          </div>

          <div className="pt-3 border-t border-espresso-200 flex items-center justify-between gap-2">
            {isAuthenticated ? (
              <>
                <div>
                  <p className="text-xs font-semibold text-espresso-900">
                    {profile?.full_name} ({profile?.role})
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      loginAsDemoRole(isAdmin ? 'CUSTOMER' : 'ADMIN')
                    }
                    className="text-xs underline text-espresso-700"
                  >
                    Switch to {isAdmin ? 'Customer' : 'Admin'} View
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-espresso-900 text-white text-xs font-semibold"
                >
                  Sign In / Join
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoRole('ADMIN');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold"
                >
                  Demo Admin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

