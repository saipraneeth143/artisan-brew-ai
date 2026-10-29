import React, { createContext, useContext } from 'react';
import { create } from 'zustand';
import { aiApi } from '../services/api';

const loadSavedCart = () => {
  try {
    const raw = localStorage.getItem('artisan_brew_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem('artisan_brew_cart', JSON.stringify(items));
  } catch {
    // ignore storage quota errors
  }
};

export const useCartStore = create((set, get) => ({
  items: loadSavedCart(),
  isDrawerOpen: false,
  dietaryRestrictions: [],
  aiAnalysis: null,
  isAnalyzing: false,
  analysisError: null,

  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  setDietaryRestrictions: (restrictions) =>
    set({ dietaryRestrictions: restrictions, aiAnalysis: null }),

  toggleDietaryRestriction: (tag) =>
    set((state) => {
      const exists = state.dietaryRestrictions.includes(tag);
      const next = exists
        ? state.dietaryRestrictions.filter((t) => t !== tag)
        : [...state.dietaryRestrictions, tag];
      return { dietaryRestrictions: next, aiAnalysis: null };
    }),

  addItem: (menuItem, quantity = 1, customizations = {}) =>
    set((state) => {
      const customKey = JSON.stringify(customizations || {});
      const existingIndex = state.items.findIndex(
        (i) =>
          i.id === menuItem.id &&
          JSON.stringify(i.customizations || {}) === customKey
      );

      let updated;
      if (existingIndex > -1) {
        updated = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [
          ...state.items,
          {
            cartLineId: `${menuItem.id}-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 6)}`,
            id: menuItem.id,
            menuItemId: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            price: Number(menuItem.price),
            category: menuItem.category,
            calories: menuItem.calories ?? null,
            imageUrl: menuItem.imageUrl || menuItem.image_url,
            dietaryTags: menuItem.dietaryTags || menuItem.dietary_tags || [],
            flavorNotes: menuItem.flavorNotes || menuItem.flavor_notes || [],
            quantity,
            customizations,
          },
        ];
      }

      saveCart(updated);
      return { items: updated, aiAnalysis: null };
    }),

  updateQuantity: (cartLineId, quantity) =>
    set((state) => {
      const updated =
        quantity <= 0
          ? state.items.filter((i) => i.cartLineId !== cartLineId)
          : state.items.map((i) =>
              i.cartLineId === cartLineId ? { ...i, quantity } : i
            );
      saveCart(updated);
      return { items: updated, aiAnalysis: null };
    }),

  removeItem: (cartLineId) =>
    set((state) => {
      const updated = state.items.filter((i) => i.cartLineId !== cartLineId);
      saveCart(updated);
      return { items: updated, aiAnalysis: null };
    }),

  clearCart: () => {
    saveCart([]);
    set({ items: [], aiAnalysis: null, analysisError: null });
  },

  runAIDietaryAudit: async () => {
    const { items, dietaryRestrictions } = get();
    if (items.length === 0) return null;

    set({ isAnalyzing: true, analysisError: null });
    try {
      const result = await aiApi.analyzeCart(items, dietaryRestrictions);
      set({ aiAnalysis: result, isAnalyzing: false });
      return result;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Unable to complete AI dietary analysis right now.';
      set({ analysisError: message, isAnalyzing: false });
      return null;
    }
  },
}));

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const store = useCartStore();

  const totalItems = store.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = store.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const estimatedCalories = store.items.reduce(
    (sum, item) => sum + (Number(item.calories) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        ...store,
        totalItems,
        subtotal,
        estimatedCalories,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

