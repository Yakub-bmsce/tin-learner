'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useUserStore } from '@/lib/store';
import { Badge } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { calculateLevel, getXPProgress } from '@/lib/utils';
import { BADGES, LANGUAGES } from '@/lib/constants';
import { Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useUserStore();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    college: user?.college || '',
    experience_level: user?.experience_level || 'Beginner',
    preferred_language: user?.preferred_language || 'English',
  });

  useEffect(() => {
    loadBadges();
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (data) {
        setBadges(data);
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          college: formData.college,
          experience_level: formData.experience_level,
          preferred_language: formData.preferred_language,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Reload user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUser(userData);
      }

      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <div className="glass-card p-8 rounded-3xl mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-4xl">
                  {user.full_name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-4xl font-bold font-syne">{user.full_name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">{user.college}</p>
                </div>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  EDIT
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    SAVE
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        full_name: user.full_name,
                        college: user.college,
                        experience_level: user.experience_level,
                        preferred_language: user.preferred_language,
                      });
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    CANCEL
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">College</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Experience Level</label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Preferred Language</label>
                  <select
                    value={formData.preferred_language}
                    onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <p className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                    Experience Level
                  </p>
                  <p className="text-lg font-bold">{user.experience_level}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <p className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                    Preferred Language
                  </p>
                  <p className="text-lg font-bold">
                    {LANGUAGES.find((l) => l.code === user.preferred_language)?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-5xl font-bold gradient-text mb-2">
                {calculateLevel(user.xp_points)}
              </div>
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Level
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-5xl font-bold gradient-text mb-2">{user.xp_points}</div>
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Total XP
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                  style={{ width: `${getXPProgress(user.xp_points)}%` }}
                ></div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-5xl font-bold gradient-text mb-2">{user.streak_count}</div>
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Day Streak 🔥
              </p>
            </div>
          </div>

          {/* Badges Section */}
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6 font-syne">🎖️ Badges</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
              {Object.entries(BADGES).map(([name, badge]) => {
                const earned = badges.some((b) => b.badge_name === name);
                return (
                  <div
                    key={name}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      earned
                        ? 'glass-card neon-glow cursor-pointer'
                        : 'bg-gray-200 dark:bg-gray-800 opacity-40'
                    }`}
                    title={badge.description}
                  >
                    <div className="text-5xl mb-2">{badge.icon}</div>
                    <p className="text-xs font-bold">{name}</p>
                    {earned && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          badges.find((b) => b.badge_name === name)?.earned_at || ''
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
