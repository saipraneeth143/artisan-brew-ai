import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AIBaristaModal from './components/AIBaristaModal';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AIBaristaPage from './pages/AIBaristaPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const [baristaModalOpen, setBaristaModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#fbf8f5] text-[#180e0a]">
            <Navbar onOpenBaristaModal={() => setBaristaModalOpen(true)} />
            <CartDrawer />
            <AIBaristaModal
              isOpen={baristaModalOpen}
              onClose={() => setBaristaModalOpen(false)}
            />

            <main className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      onOpenBaristaModal={() => setBaristaModalOpen(true)}
                    />
                  }
                />
                <Route
                  path="/menu"
                  element={
                    <MenuPage
                      onOpenBaristaModal={() => setBaristaModalOpen(true)}
                    />
                  }
                />
                <Route path="/barista" element={<AIBaristaPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-espresso-200 bg-espresso-950 text-crema py-12 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#d49b54] text-espresso-950 flex items-center justify-center">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-white text-base">
                      Artisan Brew AI
                    </p>
                    <p className="text-xs text-espresso-300">
                      Specialty Coffee Roastery • French Bakery • Groq AI Sommelier
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs text-espresso-300">
                  <Link to="/menu" className="hover:text-white">
                    Menu
                  </Link>
                  <Link to="/barista" className="hover:text-white">
                    AI Barista
                  </Link>
                  <Link to="/orders" className="hover:text-white">
                    Order Tracker
                  </Link>
                  <Link to="/admin" className="hover:text-white">
                    Admin Portal
                  </Link>
                </div>

                <p className="text-xs text-espresso-400">
                  © {new Date().getFullYear()} Artisan Brew AI. Crafted with precision.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

