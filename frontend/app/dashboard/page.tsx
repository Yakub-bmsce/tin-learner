'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, CheckCircle, Flame } from 'lucide-react';

// Hardcoded demo data
const DEMO_USER = {
  name: 'Demo User',
  coursesInProgress: 3,
  lessonsCompleted: 24,
  dayStreak: 7,
};

const COURSES_IN_PROGRESS = [
  {
    id: '1',
    name: 'Web Development Fundamentals',
    progress: 65,
    icon: '🌐',
    color: '#6C63FF',
  },
  {
    id: '2',
    name: 'Data Science Basics',
    progress: 40,
    icon: '📊',
    color: '#00E5BF',
  },
  {
    id: '3',
    name: 'UI/UX Design Principles',
    progress: 80,
    icon: '🎨',
    color: '#2BDA8E',
  },
];

const SUGGESTED_COURSES = [
  {
    id: '4',
    name: 'Cybersecurity Essentials',
    icon: '🔒',
    weeks: 14,
    color: '#FF6FD8',
  },
  {
    id: '5',
    name: 'Mobile App Development',
    icon: '📱',
    weeks: 12,
    color: '#43E97B',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="text-2xl font-bold gradient-text font-syne hover:scale-105 transition-transform">
              TinLearn
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/home" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
                Home
              </Link>
              <Link href="/domains" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
                Explore
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text font-syne mb-2">
            Welcome back 👋
          </h1>
          <p className="text-xl text-gray-300">
            Ready to continue your learning journey?
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl neon-glow"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/20 rounded-xl">
                <BookOpen className="text-primary" size={32} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase text-gray-400">
                  Courses in Progress
                </p>
                <p className="text-4xl font-bold text-white">{DEMO_USER.coursesInProgress}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl neon-glow-green"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-neonGreen/20 rounded-xl">
                <CheckCircle className="text-neonGreen" size={32} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase text-gray-400">
                  Lessons Completed
                </p>
                <p className="text-4xl font-bold text-white">{DEMO_USER.lessonsCompleted}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl neon-glow-pink"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-neonPink/20 rounded-xl">
                <Flame className="text-neonPink" size={32} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase text-gray-400">
                  Day Streak
                </p>
                <p className="text-4xl font-bold text-white">{DEMO_USER.dayStreak}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold font-syne mb-6 text-white">Continue Learning</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {COURSES_IN_PROGRESS.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/domains/${course.id}`}>
                  <div
                    className="glass-card p-6 rounded-2xl cursor-pointer neon-border"
                    style={{
                      boxShadow: `0 0 20px ${course.color}40`,
                    }}
                  >
                    <div className="text-5xl mb-4">{course.icon}</div>
                    <h3 className="text-xl font-bold mb-4 text-white">{course.name}</h3>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-400">Progress</span>
                        <span className="text-sm font-bold text-primary">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Suggested Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-syne mb-6 text-white">Suggested Next</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {SUGGESTED_COURSES.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/domains">
                  <div
                    className="glass-card p-6 rounded-2xl cursor-pointer neon-border"
                    style={{
                      boxShadow: `0 0 20px ${course.color}40`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{course.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-white">{course.name}</h3>
                        <p className="text-sm text-gray-400">⏱️ {course.weeks} weeks</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
