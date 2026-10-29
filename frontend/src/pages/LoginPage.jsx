import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, ShieldCheck, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, loginAsDemoRole } = useAuth();

  const isSignupRoute = location.pathname.includes('signup');
  const [isSignUp, setIsSignUp] = useState(isSignupRoute);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (fullName.trim().length < 2) {
          throw new Error('Please enter your full name (at least 2 characters).');
        }
        await signUp(email, password, fullName.trim());
      } else {
        await signIn(email, password);
      }
      navigate('/menu');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (role) => {
    loginAsDemoRole(role);
    navigate(role === 'ADMIN' ? '/admin' : '/menu');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-espresso-200 shadow-xl overflow-hidden">
        <div className="bg-espresso-950 text-crema p-7 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#d49b54]/20 border border-[#d49b54]/40 flex items-center justify-center mx-auto">
            <Coffee className="w-6 h-6 text-[#d49b54]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">
            {isSignUp ? 'Join Artisan Brew AI' : 'Welcome Back to the Roastery'}
          </h1>
          <p className="text-xs text-espresso-300">
            Save your flavor profile, track orders live, and unlock AI pairings.
          </p>
        </div>

        <div className="p-7 space-y-6">
          {/* Instant One-Click Role Switchers for Evaluation */}
          <div className="p-4 rounded-2xl bg-espresso-50 border border-espresso-200 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-espresso-700 text-center">
              Instant One-Click Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('CUSTOMER')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-espresso-200 text-xs font-bold text-espresso-900 hover:bg-espresso-100 shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-[#b58260]" />
                Demo Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950 hover:bg-amber-200 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                Demo Admin
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-espresso-200" />
            <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-espresso-400 font-semibold">
              Or with Supabase Email
            </span>
            <div className="flex-grow border-t border-espresso-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <div>
                <label className="block font-bold text-espresso-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Claire Moreau"
                  className="w-full rounded-xl border border-espresso-200 px-3.5 py-2.5"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-espresso-800 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="claire@artisanbrew.ai"
                className="w-full rounded-xl border border-espresso-200 px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block font-bold text-espresso-800 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-espresso-200 px-3.5 py-2.5"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-espresso-900 text-crema font-bold text-xs uppercase tracking-wider hover:bg-espresso-800 flex items-center justify-center gap-2 shadow-md"
            >
              {submitting
                ? 'Authenticating...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-espresso-700 pt-2 border-t border-espresso-100">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-espresso-950 underline"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                New to Artisan Brew AI?{' '}
                <Link
                  to="/auth/signup"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-espresso-950 underline"
                >
                  Create an Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

