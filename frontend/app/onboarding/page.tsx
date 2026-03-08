'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { LANGUAGES } from '@/lib/constants';

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    experienceLevel: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    preferredLanguage: 'English' as 'English' | 'Hindi' | 'Kannada' | 'Malayalam' | 'Telugu',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email!,
        full_name: formData.fullName,
        college: formData.college,
        experience_level: formData.experienceLevel,
        preferred_language: formData.preferredLanguage,
        xp_points: 0,
        streak_count: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      console.error('Error during onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-10 rounded-3xl max-w-2xl w-full neon-border"
      >
        <h1 className="text-4xl font-bold mb-2 text-center gradient-text font-syne">
          Welcome to TinLearn!
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Let's personalize your learning experience
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase mb-2 text-white">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-gray-800/50 text-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2 text-white">
              College/University
            </label>
            <input
              type="text"
              required
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-gray-800/50 text-white"
              placeholder="Enter your college name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2 text-white">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, experienceLevel: level as any })}
                  className={`py-3 px-4 rounded-xl font-bold uppercase transition-all ${
                    formData.experienceLevel === level
                      ? 'bg-primary text-white neon-glow'
                      : 'bg-gray-800/50 hover:bg-primary/20 text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2 text-white">
              Preferred Language
            </label>
            <div className="grid grid-cols-2 gap-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredLanguage: lang.code as any })}
                  className={`py-3 px-4 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                    formData.preferredLanguage === lang.code
                      ? 'bg-accent text-white neon-glow-green'
                      : 'bg-gray-800/50 hover:bg-accent/20 text-white'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SETTING UP...' : 'START LEARNING'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
