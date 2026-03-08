'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LEARNER_TYPES = [
  {
    id: 'fresh-start',
    icon: '🌱',
    title: 'Fresh Start',
    description: 'New to tech and ready to begin',
  },
  {
    id: 'curious-explorer',
    icon: '🔍',
    title: 'Curious Explorer',
    description: 'Learning basics and exploring options',
  },
  {
    id: 'hands-on-builder',
    icon: '🔧',
    title: 'Hands-on Builder',
    description: 'Building projects and gaining experience',
  },
  {
    id: 'seasoned-pro',
    icon: '⚡',
    title: 'Seasoned Pro',
    description: 'Experienced and expanding expertise',
  },
];

const DOMAINS = [
  { id: 'web-dev', name: 'Web Development', icon: '🌐', weeks: 12, color: '#6C63FF' },
  { id: 'data-science', name: 'Data Science', icon: '📊', weeks: 16, color: '#00E5BF' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒', weeks: 14, color: '#FF6FD8' },
  { id: 'mobile-dev', name: 'Mobile Development', icon: '📱', weeks: 12, color: '#43E97B' },
  { id: 'devops', name: 'DevOps', icon: '⚙️', weeks: 10, color: '#FA8BFF' },
  { id: 'ui-ux', name: 'UI/UX Design', icon: '🎨', weeks: 8, color: '#2BDA8E' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', weeks: 18, color: '#667EEA' },
  { id: 'cloud', name: 'Cloud Computing', icon: '☁️', weeks: 12, color: '#764BA2' },
  { id: 'blockchain', name: 'Blockchain', icon: '⛓️', weeks: 14, color: '#F093FB' },
];

export default function DomainsPage() {
  const [selectedLearner, setSelectedLearner] = useState('');

  const getPersonalizedHeading = () => {
    switch (selectedLearner) {
      case 'fresh-start':
        return 'Perfect domains to start your tech journey';
      case 'curious-explorer':
        return 'Explore these domains to find your passion';
      case 'hands-on-builder':
        return 'Build real projects in these domains';
      case 'seasoned-pro':
        return 'Advanced domains to expand your expertise';
      default:
        return 'Choose a domain to start learning';
    }
  };

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
              <Link href="/domains" className="font-bold uppercase text-primary transition hover:scale-105">
                Explore Domains
              </Link>
              <Link href="/dashboard" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-center gradient-text font-syne">
            Explore Domains
          </h1>
          <p className="text-center text-xl text-gray-300 mb-12">
            First, tell us what kind of learner you are right now
          </p>

          {/* Learner Quiz Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              What kind of learner are you right now?
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {LEARNER_TYPES.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedLearner(type.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`glass-card p-6 rounded-2xl text-center cursor-pointer transition-all ${
                    selectedLearner === type.id
                      ? 'neon-border neon-glow bg-primary/20'
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <div className="text-5xl mb-3">{type.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-white">{type.title}</h3>
                  <p className="text-sm text-gray-400">{type.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Domain Grid - Shows after learner type selection */}
          {selectedLearner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-white">
                {getPersonalizedHeading()}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {DOMAINS.map((domain, index) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link href={`/domains/${domain.id}`}>
                      <div
                        className="glass-card p-8 rounded-3xl cursor-pointer neon-border h-full"
                        style={{
                          boxShadow: `0 0 30px ${domain.color}40`,
                        }}
                      >
                        <div className="text-6xl mb-4">{domain.icon}</div>
                        <h2 className="text-2xl font-bold mb-3 font-syne text-white">{domain.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>⏱️ {domain.weeks} weeks</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
