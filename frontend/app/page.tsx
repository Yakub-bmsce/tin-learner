'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      router.push('/home');
    }, 1000);
  };

  const handleDemoMode = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-10 rounded-3xl max-w-md w-full neon-border"
      >
        <h1 className="text-4xl font-bold mb-2 text-center gradient-text font-syne">
          Welcome to TinLearn
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Sign in to continue your learning journey
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-bold uppercase mb-2 text-white">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                emailError ? 'border-red-500' : 'border-primary/30'
              } focus:border-primary outline-none bg-gray-800/50 text-white`}
              placeholder="your@email.com"
            />
            {emailError && (
              <p className="text-red-400 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2 text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                passwordError ? 'border-red-500' : 'border-primary/30'
              } focus:border-primary outline-none bg-gray-800/50 text-white`}
              placeholder="••••••••"
            />
            {passwordError && (
              <p className="text-red-400 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800/50 text-gray-400 font-bold uppercase">
              Or
            </span>
          </div>
        </div>

        <button
          onClick={handleDemoMode}
          className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-neonPink to-neonGreen text-white font-bold uppercase text-lg hover:scale-105 transition-transform"
        >
          🚀 TRY DEMO MODE
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Demo mode lets you explore all features without signing up
        </p>
      </motion.div>
    </div>
  );
}
