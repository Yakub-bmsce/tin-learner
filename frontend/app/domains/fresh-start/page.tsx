'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Heart, Zap, MessageCircle, X } from 'lucide-react';

export default function FreshStartPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hi! 👋 I\'m here to help you start your tech journey. Ask me anything - I explain things in simple terms!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handlePathSelect = async (path: string) => {
    setSelectedPath(path);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          mode: 'custom',
          jobDescription: `I am a complete beginner with no tech experience. I want to ${path}. Please create a simple roadmap using non-technical language that I can understand.`,
          experienceLevel: 'Beginner',
          language: 'English'
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  setRoadmap(JSON.parse(jsonMatch[0]));
                }
              } else {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullResponse += parsed.content;
                  }
                } catch (e) {}
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          message: `I am a complete beginner with no tech knowledge. ${chatInput}`,
          level: 'Beginner',
          domain: 'General Tech',
          language: 'English'
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setChatMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
              } else {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullResponse += parsed.content;
                  }
                } catch (e) {}
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <Link href="/domains" className="text-2xl font-bold text-white font-syne hover:scale-105 transition-transform">
            ← Back to Domains
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4 font-syne">
            Welcome to the World of Tech! 🌟
          </h1>
          <p className="text-2xl text-white/90">
            No experience needed - we'll guide you from zero
          </p>
        </motion.div>

        {/* How Tech Changed the World */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-8 font-syne">
            How Tech Changed the World 🌍
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-2xl font-bold mb-3 text-purple-600">Healthcare</h3>
              <p className="text-gray-700">AI detecting diseases early, telemedicine connecting patients with doctors remotely, saving millions of lives!</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-3 text-pink-600">Education</h3>
              <p className="text-gray-700">Online learning platforms, AI tutors helping students 24/7, making education accessible to everyone!</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-2xl font-bold mb-3 text-blue-600">Business</h3>
              <p className="text-gray-700">E-commerce revolutionizing shopping, digital payments making transactions instant and secure!</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Visual Roadmap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12 font-syne">
            Your Learning Journey 📍
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ rotate: -5, scale: 1.1 }}
              className="bg-yellow-300 p-6 rounded-2xl shadow-xl transform rotate-2"
            >
              <div className="text-5xl mb-3">💻</div>
              <h3 className="font-bold text-lg mb-2">Week 1-2</h3>
              <p className="text-sm">What is a Computer?</p>
            </motion.div>

            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="bg-pink-300 p-6 rounded-2xl shadow-xl transform -rotate-2"
            >
              <div className="text-5xl mb-3">🌐</div>
              <h3 className="font-bold text-lg mb-2">Week 3-4</h3>
              <p className="text-sm">How the Internet Works</p>
            </motion.div>

            <motion.div
              whileHover={{ rotate: -5, scale: 1.1 }}
              className="bg-blue-300 p-6 rounded-2xl shadow-xl transform rotate-1"
            >
              <div className="text-5xl mb-3">🎨</div>
              <h3 className="font-bold text-lg mb-2">Week 5-6</h3>
              <p className="text-sm">Your First Website</p>
            </motion.div>

            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="bg-green-300 p-6 rounded-2xl shadow-xl transform -rotate-1"
            >
              <div className="text-5xl mb-3">🤖</div>
              <h3 className="font-bold text-lg mb-2">Week 7-8</h3>
              <p className="text-sm">AI Tools for Everyone</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Your Journey Starts Here */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12 font-syne">
            Your Journey Starts Here! 🚀
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePathSelect('create beautiful websites and apps')}
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-10 rounded-3xl shadow-2xl text-center"
            >
              <div className="text-7xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2">I want to create websites</h3>
              <p className="text-white/80">Build beautiful things people can see and use</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePathSelect('understand and use AI technology')}
              className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-10 rounded-3xl shadow-2xl text-center"
            >
              <div className="text-7xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-2">I want to understand AI</h3>
              <p className="text-white/80">Learn how smart computers work</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePathSelect('work with data and find insights')}
              className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-10 rounded-3xl shadow-2xl text-center"
            >
              <div className="text-7xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2">I want to work with data</h3>
              <p className="text-white/80">Turn numbers into stories</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-xl">Creating your personalized roadmap...</p>
          </div>
        )}

        {/* Roadmap Display */}
        {roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-600">Your Personalized Roadmap 🗺️</h2>
            <div className="space-y-6">
              {roadmap.modules?.map((module: any, index: number) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6 py-4">
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-gray-700 mb-2">{module.description}</p>
                  <p className="text-sm text-gray-500">⏱️ {module.estimated_hours} hours</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Chat Bubble */}
      {!showChat && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-full shadow-2xl z-50"
        >
          <MessageCircle size={32} />
        </motion.button>
      )}

      {/* Chat Window */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 w-96 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">Beginner Helper 🤗</h3>
            <button onClick={() => setShowChat(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 rounded-full border-2 border-purple-300 focus:border-purple-500 outline-none"
              />
              <button
                onClick={handleChatSend}
                className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
