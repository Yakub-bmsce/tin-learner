'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Send, Bot, User } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function MentorPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const moduleTitle = searchParams.get('module');
  const roadmapId = searchParams.get('roadmapId');

  useEffect(() => {
    if (moduleTitle) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi! I'm your AI mentor. I see you're working on "${moduleTitle}". How can I help you today?`,
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I'm your AI mentor at TinLearn. I'm here to help you with any questions about your learning journey. What would you like to know?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [moduleTitle]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          message: input,
          roadmapId,
          moduleTitle,
          level: 'Intermediate',
          domain: moduleTitle || 'General',
          language: 'English',
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: fullResponse,
                    timestamp: new Date(),
                  },
                ]);
                setStreamingContent('');
              } else {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullResponse += parsed.content;
                    setStreamingContent(fullResponse);
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
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-2xl font-bold gradient-text font-syne hover:scale-105 transition-transform">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-6 py-8 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold gradient-text font-syne flex items-center gap-3">
            <Bot size={40} />
            AI Mentor
          </h1>
          <p className="text-gray-400 mt-2">
            Ask me anything about your learning journey
          </p>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 glass-card rounded-3xl p-6 mb-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-accent text-white'
                  }`}
                >
                  {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div
                  className={`flex-1 p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary/10 border-2 border-primary/30'
                      : 'bg-accent/10 border-2 border-accent/30'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-white">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Streaming Message */}
            {streamingContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-accent text-white">
                  <Bot size={20} />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-accent/10 border-2 border-accent/30">
                  <p className="whitespace-pre-wrap text-white">{streamingContent}</p>
                  <div className="inline-block w-2 h-4 bg-accent animate-pulse ml-1"></div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-gray-800/50 text-white disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
