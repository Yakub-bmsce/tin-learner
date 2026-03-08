'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Roadmap, RoadmapModule } from '@/lib/supabase';
import { useUserStore } from '@/lib/store';
import { CheckCircle2, Circle, ExternalLink, MessageCircle } from 'lucide-react';

export default function RoadmapViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [modules, setModules] = useState<RoadmapModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, [params.id]);

  const loadRoadmap = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/${params.id}`);
      const data = await response.json();
      
      setRoadmap(data.roadmap);
      setModules(data.modules.map((m: any) => ({
        ...m,
        resources: JSON.parse(m.resources),
        mini_project: JSON.parse(m.mini_project),
      })));
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceComplete = async (moduleId: string, resourceIndex: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/${params.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          moduleId,
          resourceIndex,
        }),
      });
      
      // Reload roadmap to update progress
      loadRoadmap();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const openMentorChat = (moduleTitle: string) => {
    router.push(`/mentor?module=${encodeURIComponent(moduleTitle)}&roadmapId=${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div className="skeleton h-12 w-64 mb-8 rounded"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-8 rounded-2xl">
                <div className="skeleton h-8 w-48 mb-4 rounded"></div>
                <div className="skeleton h-20 w-full rounded"></div>
              </div>
            ))}
          </div>
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
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text font-syne">
            {roadmap?.domain}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            {roadmap?.goal_input}
          </p>

          {/* Timeline */}
          <div className="relative">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-8 relative"
              >
                {/* Timeline line */}
                {index < modules.length - 1 && (
                  <div className="absolute left-6 top-24 w-1 h-full bg-gradient-to-b from-primary to-accent"></div>
                )}

                <div className="glass-card p-8 rounded-3xl neon-border">
                  {/* Module Header */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        module.difficulty === 'Beginner' ? 'bg-neonGreen/20 text-neonGreen' :
                        module.difficulty === 'Intermediate' ? 'bg-accent/20 text-accent' :
                        'bg-neonPink/20 text-neonPink'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold font-syne">{module.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          module.difficulty === 'Beginner' ? 'bg-neonGreen/20 text-neonGreen' :
                          module.difficulty === 'Intermediate' ? 'bg-accent/20 text-accent' :
                          'bg-neonPink/20 text-neonPink'
                        }`}>
                          {module.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {module.description}
                      </p>
                      {module.translated_description && user?.preferred_language !== 'English' && (
                        <p className="text-gray-500 dark:text-gray-500 italic border-l-4 border-accent pl-4 mt-2">
                          {module.translated_description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        ⏱️ Estimated: {module.estimated_hours} hours
                      </p>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 font-syne">📚 Resources</h3>
                    <div className="space-y-3">
                      {module.resources.map((resource, rIndex) => (
                        <div
                          key={rIndex}
                          className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-primary/10 transition"
                        >
                          <button
                            onClick={() => handleResourceComplete(module.id, rIndex)}
                            className="flex-shrink-0"
                          >
                            <Circle className="text-primary" size={24} />
                          </button>
                          <div className="flex-1">
                            <p className="font-bold">{resource.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {resource.type}
                            </p>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-primary hover:text-accent transition"
                          >
                            <ExternalLink size={20} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini Project */}
                  {module.mini_project && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4 font-syne">🚀 Mini Project</h3>
                      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30">
                        <h4 className="text-lg font-bold mb-2">{module.mini_project.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {module.mini_project.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Expected Output:</strong> {module.mini_project.expected_output}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Ask AI Button */}
                  <button
                    onClick={() => openMentorChat(module.title)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    ASK AI ABOUT THIS MODULE
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
