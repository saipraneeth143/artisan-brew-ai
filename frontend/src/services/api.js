import axios from 'axios';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const normalizeApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (raw) {
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  return import.meta.env.PROD
    ? 'https://artisan-brew-ai.onrender.com/api'
    : 'http://localhost:5000/api';
};

const API_BASE_URL = normalizeApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const demoToken = localStorage.getItem('artisan_brew_demo_token');
    if (demoToken) {
      config.headers.Authorization = `Bearer ${demoToken}`;
      return config;
    }

    if (isSupabaseConfigured && supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const menuApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/menu', { params });
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post('/menu', payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/menu/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },
};

export const aiApi = {
  recommend: async (preferences) => {
    const response = await api.post('/ai/recommend', preferences);
    return response.data;
  },
  analyzeCart: async (cartItems, dietaryRestrictions) => {
    const response = await api.post('/ai/analyze-cart', {
      cartItems,
      dietaryRestrictions,
    });
    return response.data;
  },
};

export const ordersApi = {
  create: async (payload) => {
    const response = await api.post('/orders', payload);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  getAllOrdersAdmin: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },
  updateStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

export default api;
