'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, BookOpen, ArrowLeft } from 'lucide-react';

export default function FreshStartRoadmapPage() {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('freshStartRoadmap');
    if (stored) {
      const data = JSON.parse(stored);
      setRoadmapData(data);
    } else {
      router.push('/domains/fresh-start');
    }
  }, [router]);

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  const { path, roadmap } = roadmapData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <Link href="/domains/fresh-start" className="text-2xl font-bold text-white font-syne hover:scale-105 transition-transform inline-flex items-center gap-2">
            <ArrowLeft className="w-6 h-6" />
            Back to Fresh Start
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4 font-syne">
            Your Personalized Learning Roadmap 🗺️
          </h1>
          <p className="text-2xl text-white/90 capitalize">
            {path}
          </p>
        </motion.div>

        {/* Roadmap Modules */}
        <div className="space-y-6">
          {roadmap.modules?.map((module: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              {/* Module Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{module.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {module.estimated_hours} hours
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {module.level || 'Beginner'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Module Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {module.description}
              </p>

              {/* Resources */}
              {module.resources && module.resources.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Learning Resources
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {module.resources.map((resource: any, rIndex: number) => (
                      <a
                        key={rIndex}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">
                            {resource.type === 'video' ? '📹' : resource.type === 'article' ? '📄' : '📚'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 mb-1">{resource.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Mini Project */}
              {module.mini_project && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Hands-on Project
                  </h3>
                  <h4 className="font-semibold text-gray-800 mb-2">{module.mini_project.title}</h4>
                  <p className="text-gray-700 mb-3">{module.mini_project.description}</p>
                  
                  {module.mini_project.expected_output && (
                    <div className="mb-3">
                      <span className="font-semibold text-gray-800">Expected Output: </span>
                      <span className="text-gray-700">{module.mini_project.expected_output}</span>
                    </div>
                  )}
                  
                  {module.mini_project.skills_practiced && module.mini_project.skills_practiced.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {module.mini_project.skills_practiced.map((skill: string, sIndex: number) => (
                        <span key={sIndex} className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/domains/fresh-start"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform"
          >
            Try Another Path
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
