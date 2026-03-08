'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

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
              <Link href="/domains" className="font-bold uppercase text-gray-300 hover:text-primary transition hover:scale-105">
                Explore Domains
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="px-6 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/50 text-primary font-bold uppercase text-sm">
              🤖 AI-Powered Learning
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center gradient-text font-syne leading-tight">
            Master Tech Skills with Personalized AI Learning Paths
          </h1>

          {/* Content Paragraphs */}
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed mb-12">
            <p>
              TinLearn is an AI-powered platform designed to help you master technology domains through personalized learning experiences. Whether you're starting fresh in web development, diving deep into data science, or exploring cybersecurity, our intelligent system creates custom roadmaps tailored to your goals and learning style.
            </p>
            
            <p>
              Unlike traditional learning platforms that offer one-size-fits-all courses, TinLearn adapts in real-time to your progress and preferences. Our AI analyzes your experience level, learning pace, and career objectives to generate dynamic learning paths across multiple domains including AI, cloud computing, blockchain, mobile development, and more. Each roadmap includes curated resources, hands-on projects, and interactive quizzes to ensure you're not just learning concepts, but building real skills.
            </p>
            
            <p>
              The value is simple: spend less time planning what to learn and more time actually growing your skills. With TinLearn, you get instant access to structured learning paths, progress tracking, and an AI mentor available 24/7 to answer questions and guide you through challenges. Join thousands of learners who are accelerating their tech careers with personalized, AI-driven education.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/domains')}
              className="btn-primary flex items-center gap-3 text-lg px-8 py-4"
            >
              🎯 EXPLORE DOMAINS
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">© 2024 TinLearn. Built for Indian Students.</p>
        </div>
      </footer>
    </div>
  );
}
