'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Post } from '@/lib/supabase';
import { useUserStore } from '@/lib/store';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import { DOMAINS } from '@/lib/constants';

export default function CommunityPage() {
  const { user } = useUserStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', domainTag: '' });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/community/posts`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/community/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          title: newPost.title,
          content: newPost.content,
          domainTag: newPost.domainTag,
        }),
      });

      if (response.ok) {
        setNewPost({ title: '', content: '', domainTag: '' });
        setShowCreatePost(false);
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
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
                <div className="skeleton h-8 w-full mb-4 rounded"></div>
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
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-bold gradient-text font-syne">Community</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
              Share knowledge and connect with learners
            </p>
          </motion.div>

          <button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            CREATE POST
          </button>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 font-syne">Create a Post</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Post title..."
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
              />
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share your thoughts, questions, or insights..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50 resize-none"
              />
              <select
                value={newPost.domainTag}
                onChange={(e) => setNewPost({ ...newPost, domainTag: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary outline-none bg-white/50 dark:bg-gray-800/50"
              >
                <option value="">Select a domain tag (optional)</option>
                {DOMAINS.map((domain) => (
                  <option key={domain.id} value={domain.name}>
                    {domain.icon} {domain.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-4">
                <button onClick={handleCreatePost} className="btn-primary flex-1">
                  PUBLISH POST
                </button>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="btn-secondary flex-1"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                  {post.users?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">{post.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-bold">{post.users?.full_name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    {post.domain_tag && (
                      <>
                        <span>•</span>
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold uppercase text-xs">
                          {post.domain_tag}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">
                {post.content}
              </p>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-neonPink transition"
                >
                  <Heart size={20} />
                  <span className="font-bold">{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition">
                  <MessageCircle size={20} />
                  <span className="font-bold">Comment</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="glass-card p-12 rounded-3xl text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No posts yet. Be the first to share!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
