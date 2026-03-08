'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { DOMAINS } from '@/lib/constants';
import { useUserStore } from '@/lib/store';

export default function GeneratePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [mode, setMode] = useState<'domain' | 'job'>('domain');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  const handleGenerate = async () => {
    if (mode === 'domain' && !selectedDomain) {
      alert('Please select a domain');
      return;
    }
    if (mode === 'job' && !jobDescription.trim()) {
      alert('Please paste a job description');
      return;
    }

    setGenerating(true);
    setStreamedContent('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          mode,
          domain: selectedDomain,
          jobDescription,
          experienceLevel: user?.experience_level,
          language: user?.preferred_language,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let roadmapId = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // Redirect to roadmap view
                if (roadmapId) {
                  router.push(`/roadmap/${roadmapId}`);
                }
              } else {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.roadmapId) {
                    roadmapId = parsed.roadmapId;
                  }
                  if (parsed.content) {
                    setStreamedContent((prev) => prev + parsed.content);
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-4 text-center gradient-text font-syne">
            Generate Your Roadmap
          </h1>
          <p className="text-center text-xl text-gray-400 mb-12">
            Choose how you want to create your personalized learning path
          </p>

          {/* Mode Selection */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setMode('domain')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold uppercase transition-all ${
                mode === 'domain'
                  ? 'bg-primary text-white neon-glow'
                  : 'glass-card hover:bg-primary/10'
              }`}
            >
              📚 Pick a Domain
            </button>
            <button
              onClick={() => setMode('job')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold uppercase transition-all ${
                mode === 'job'
                  ? 'bg-accent text-white neon-glow-green'
                  : 'glass-card hover:bg-accent/10'
              }`}
            >
              💼 Paste Job Description
            </button>
          </div>

          {/* Domain Mode */}
          {mode === 'domain' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 rounded-3xl mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 font-syne">Select a Domain</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.name)}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      selectedDomain === domain.name
                        ? 'neon-border neon-glow'
                        : 'bg-gray-800/50 hover:bg-primary/10'
                    }`}
                    style={{
                      boxShadow: selectedDomain === domain.name ? `0 0 30px ${domain.color}60` : 'none',
                    }}
                  >
                    <div className="text-4xl mb-2">{domain.icon}</div>
                    <p className="font-bold text-sm">{domain.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {domain.estimatedWeeks} weeks
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Job Description Mode */}
          {mode === 'job' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 rounded-3xl mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 font-syne">Paste Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here. AI will extract required skills and build a custom roadmap..."
                className="w-full h-64 px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-gray-800/50 resize-none text-white"
              />
            </motion.div>
          )}

          {/* Generate Button */}
          {!generating && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full btn-primary text-xl py-6 disabled:opacity-50"
            >
              ✨ GENERATE ROADMAP
            </button>
          )}

          {/* Streaming Content */}
          {generating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="text-xl font-bold">Generating your personalized roadmap...</p>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-dmSans text-sm">
                  {streamedContent}
                </pre>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
