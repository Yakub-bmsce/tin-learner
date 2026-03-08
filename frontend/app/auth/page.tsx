'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  const handleDemoMode = () => {
    router.push('/dashboard');
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
            <label className="block text-sm font-bold uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
              placeholder="••••••••"
            />
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
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 font-bold uppercase">
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

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Demo mode lets you explore all features without signing up
        </p>
      </motion.div>
    </div>
  );
}
