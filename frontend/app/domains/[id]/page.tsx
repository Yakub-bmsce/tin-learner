'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

type DomainContent = {
  concepts: Array<{ title: string; description: string }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  exercises: Array<{
    title: string;
    description: string;
    difficulty: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    duration: string;
    skills: string[];
  }>;
};

export default function DomainDetailPage() {
  const params = useParams();
  const domainId = params.id as string;
  const domain = DOMAINS.find((d) => d.id === domainId);

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<DomainContent | null>(null);
  const [activeTab, setActiveTab] = useState<'concepts' | 'quiz' | 'exercises' | 'projects'>('concepts');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (domain) {
      loadDomainContent();
    }
  }, [domain]);

  const loadDomainContent = async () => {
    setLoading(true);
    try {
      console.log('🔥 Calling backend API...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/domain/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainName: domain?.name,
          domainId: domain?.id,
        }),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Got data:', data);
      setContent(data.content);
    } catch (error) {
      console.error('❌ Error loading domain content:', error);
      alert('Failed to generate content. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (content && index === content.quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (content && currentQuestion < content.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (!domain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <p className="text-white text-xl">Domain not found</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 glass-card border-b border-primary/20">
          <div className="container mx-auto px-6 py-4">
            <Link href="/domains" className="text-2xl font-bold gradient-text font-syne hover:scale-105 transition-transform">
              ← Back to Domains
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
            <p className="text-xl text-white font-bold">Generating content with AI...</p>
            <p className="text-gray-400 mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <Link href="/domains" className="text-2xl font-bold gradient-text font-syne hover:scale-105 transition-transform">
            ← Back to Domains
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{domain.icon}</div>
            <div>
              <h1 className="text-5xl font-bold gradient-text font-syne">{domain.name}</h1>
              <p className="text-gray-400 mt-2">⏱️ {domain.weeks} weeks</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {['concepts', 'quiz', 'exercises', 'projects'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-bold uppercase transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary text-white neon-glow'
                  : 'glass-card hover:bg-primary/20 text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'concepts' && content && (
          <div className="grid md:grid-cols-2 gap-6">
            {content.concepts.map((concept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <h3 className="text-xl font-bold mb-3 text-white">{concept.title}</h3>
                <p className="text-gray-300">{concept.description}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'quiz' && content && (
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 rounded-3xl">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold uppercase text-gray-400">
                    Question {currentQuestion + 1} of {content.quiz.length}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    Score: {score}/{content.quiz.length}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / content.quiz.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-white">
                {content.quiz[currentQuestion].question}
              </h3>

              <div className="space-y-3 mb-6">
                {content.quiz[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      showExplanation && index === content.quiz[currentQuestion].correctAnswer
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : showExplanation && index === selectedAnswer
                        ? 'bg-red-500/20 border-2 border-red-500'
                        : selectedAnswer === index
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-gray-800/50 hover:bg-primary/10'
                    }`}
                  >
                    <span className="font-bold text-white">{option}</span>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-primary/10 border-2 border-primary/30 mb-6"
                >
                  <p className="text-sm font-bold uppercase text-primary mb-2">Explanation</p>
                  <p className="text-gray-300">{content.quiz[currentQuestion].explanation}</p>
                </motion.div>
              )}

              {showExplanation && currentQuestion < content.quiz.length - 1 && (
                <button onClick={handleNextQuestion} className="w-full btn-primary">
                  NEXT QUESTION
                </button>
              )}

              {showExplanation && currentQuestion === content.quiz.length - 1 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-4">
                    Quiz Complete! Score: {score}/{content.quiz.length}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScore(0);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                    }}
                    className="btn-primary"
                  >
                    RETAKE QUIZ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exercises' && content && (
          <div className="grid md:grid-cols-2 gap-6">
            {content.exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{exercise.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      exercise.difficulty === 'Beginner'
                        ? 'bg-neonGreen/20 text-neonGreen'
                        : exercise.difficulty === 'Intermediate'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-neonPink/20 text-neonPink'
                    }`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-gray-300">{exercise.description}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && content && (
          <div className="space-y-6">
            {content.projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="flex items-start gap-6">
                  <div className="text-5xl">{domain.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">⏱️ Duration: {project.duration}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
