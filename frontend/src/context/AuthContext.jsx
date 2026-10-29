import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USERS = {
  CUSTOMER: {
    id: '00000000-0000-4000-8000-000000000002',
    email: 'claire@artisanbrew.ai',
    full_name: 'Claire Moreau',
    role: 'CUSTOMER',
    token: 'demo-customer-token',
  },
  ADMIN: {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'admin@artisanbrew.ai',
    full_name: 'Antoine Laurent (Head Roaster & Admin)',
    role: 'ADMIN',
    token: 'demo-admin-token',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSupabaseProfile = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setProfile(null);
      return;
    }

    setUser(authUser);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!error && data) {
          setProfile(data);
          return;
        }
      } catch {
        // Fallback to metadata if profiles table isn't populated yet
      }
    }

    setProfile({
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Valued Customer',
      role: authUser.user_metadata?.role || 'CUSTOMER',
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      const savedDemoRole = localStorage.getItem('artisan_brew_demo_role');
      if (savedDemoRole && DEMO_USERS[savedDemoRole]) {
        const demoProfile = DEMO_USERS[savedDemoRole];
        localStorage.setItem('artisan_brew_demo_token', demoProfile.token);
        setUser({ id: demoProfile.id, email: demoProfile.email });
        setProfile(demoProfile);
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await loadSupabaseProfile(session.user);
        }

        const { data: listener } = supabase.auth.onAuthStateChange(
          async (_event, currentSession) => {
            if (localStorage.getItem('artisan_brew_demo_role')) return;
            if (currentSession?.user) {
              await loadSupabaseProfile(currentSession.user);
            } else {
              setUser(null);
              setProfile(null);
            }
          }
        );

        setLoading(false);
        return () => {
          listener?.subscription?.unsubscribe();
        };
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === 'admin@artisanbrew.ai') {
      loginAsDemoRole('ADMIN');
      return { user: DEMO_USERS.ADMIN };
    }
    if (normalizedEmail === 'claire@artisanbrew.ai') {
      loginAsDemoRole('CUSTOMER');
      return { user: DEMO_USERS.CUSTOMER };
    }

    if (isSupabaseConfigured && supabase) {
      localStorage.removeItem('artisan_brew_demo_role');
      localStorage.removeItem('artisan_brew_demo_token');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;
      await loadSupabaseProfile(data.user);
      return data;
    }

    loginAsDemoRole('CUSTOMER');
    return { user: DEMO_USERS.CUSTOMER };
  };

  const signUp = async (email, password, fullName, role = 'CUSTOMER') => {
    const normalizedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      localStorage.removeItem('artisan_brew_demo_role');
      localStorage.removeItem('artisan_brew_demo_token');

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        await loadSupabaseProfile(data.user);
      }
      return data;
    }

    loginAsDemoRole(role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER');
    return { user: DEMO_USERS[role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'] };
  };

  const loginAsDemoRole = (role = 'CUSTOMER') => {
    const target = DEMO_USERS[role] || DEMO_USERS.CUSTOMER;
    localStorage.setItem('artisan_brew_demo_role', role);
    localStorage.setItem('artisan_brew_demo_token', target.token);
    setUser({ id: target.id, email: target.email });
    setProfile(target);
  };

  const signOut = async () => {
    localStorage.removeItem('artisan_brew_demo_role');
    localStorage.removeItem('artisan_brew_demo_token');
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: profile?.role === 'ADMIN',
        isAuthenticated: Boolean(user),
        loading,
        signIn,
        signUp,
        signOut,
        loginAsDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

