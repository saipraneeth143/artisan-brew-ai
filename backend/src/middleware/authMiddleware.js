import { supabase, isSupabaseConfigured, localStore } from '../config/supabase.js';

/**
 * Validates JWT token from Authorization: Bearer <token> header against Supabase.
 * Also supports demo session tokens (`demo-admin-token`, `demo-customer-token`, or `demo-user:<id>`)
 * for instant testing of Customer and Admin flows.
 */
export const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized: Missing or malformed Authorization Bearer token.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Always support demo tokens for quick role testing
    if (token === 'demo-admin-token') {
      req.user = localStore.profiles[0];
      return next();
    }
    if (token === 'demo-customer-token') {
      req.user = localStore.profiles[1];
      return next();
    }
    if (token.startsWith('demo-user:')) {
      const userId = token.replace('demo-user:', '');
      const found = localStore.profiles.find((p) => p.id === userId);
      if (found) {
        req.user = found;
        return next();
      }
    }

    if (!isSupabaseConfigured) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session token.' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or expired Supabase JWT token.',
      });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata || {},
    };

    return next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    return res.status(500).json({ error: 'Internal authentication verification error.' });
  }
};

/**
 * Optional authentication middleware for routes like /api/ai/recommend
 * where guests can interact, and logged-in users also get their recommendation logged.
 */
export const optionalSupabaseToken = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (token === 'demo-admin-token') {
      req.user = localStore.profiles[0];
      return next();
    }
    if (token === 'demo-customer-token') {
      req.user = localStore.profiles[1];
      return next();
    }
    if (token.startsWith('demo-user:')) {
      const userId = token.replace('demo-user:', '');
      req.user = localStore.profiles.find((p) => p.id === userId) || null;
      return next();
    }

    if (!isSupabaseConfigured) {
      req.user = null;
      return next();
    }

    const { data } = await supabase.auth.getUser(token);
    req.user = data?.user ? { id: data.user.id, email: data.user.email } : null;
    return next();
  } catch {
    req.user = null;
    return next();
  }
};

/**
 * Queries public.profiles to ensure role === 'ADMIN'
 */
export const verifyAdminRole = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: User context missing.' });
    }

    // Check demo/local admin first
    const localProfile = localStore.profiles.find((p) => p.id === req.user.id);
    if (localProfile && localProfile.role === 'ADMIN') {
      req.userProfile = localProfile;
      return next();
    }

    if (req.user.user_metadata?.role === 'ADMIN') {
      req.userProfile = {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.user_metadata?.full_name || 'Admin',
        role: 'ADMIN',
      };
      return next();
    }

    if (!isSupabaseConfigured) {
      return res.status(403).json({
        error: 'Forbidden: Administrator privileges required for this operation.',
      });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || profile.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden: Administrator privileges required for this operation.',
      });
    }

    req.userProfile = profile;
    return next();
  } catch (err) {
    console.error('Admin verification error:', err);
    return res.status(500).json({ error: 'Failed to verify administrator permissions.' });
  }
};
