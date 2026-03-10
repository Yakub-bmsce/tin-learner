'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function GlobalChatbot() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: '👋 Hey! I\'m your AI learning buddy! Ask me anything about tech - I explain stuff in a fun, simple way! 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          message: input,
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
                setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '😅 Oops! Something went wrong. Try asking again!' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!showChat && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-full shadow-2xl z-50 hover:shadow-purple-500/50 transition-shadow"
          >
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">AI Learning Buddy 🤖</h3>
                <p className="text-xs text-white/80">Always here to help!</p>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="hover:bg-white/20 p-2 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-white text-gray-800 shadow-md'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything... 💭"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-full border-2 border-purple-300 focus:border-purple-500 outline-none text-sm disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:shadow-lg transition disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                💡 Tip: I explain things in simple, fun ways!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
