const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get posts
router.get('/posts', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ posts: [] });
    }

    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        users (full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    res.json({ posts: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/posts', async (req, res) => {
  const { userId, title, content, domainTag } = req.body;

  try {
    if (!supabase) {
      return res.json({ post: { id: 'demo-post', title, content } });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        title,
        content,
        domain_tag: domainTag,
      })
      .select()
      .single();

    if (error) throw error;

    // Award badge for first post
    const { data: existingBadge } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_name', 'Helpful Human')
      .single();

    if (!existingBadge) {
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_name: 'Helpful Human',
      });
    }

    res.json({ post: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like post
router.post('/posts/:id/like', async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.id;

  try {
    if (!supabase) {
      return res.json({ liked: true });
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      await supabase.from('post_likes').delete().eq('id', existingLike.id);
      await supabase.rpc('decrement_post_likes', { post_id: postId });
      res.json({ liked: false });
    } else {
      // Like
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      await supabase.rpc('increment_post_likes', { post_id: postId });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments
router.get('/posts/:id/comments', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ comments: [] });
    }

    const { data } = await supabase
      .from('post_comments')
      .select(`
        *,
        users (full_name, avatar_url)
      `)
      .eq('post_id', req.params.id)
      .order('created_at', { ascending: true });

    res.json({ comments: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/posts/:id/comments', async (req, res) => {
  const { userId, content } = req.body;

  try {
    if (!supabase) {
      return res.json({ comment: { id: 'demo-comment', content } });
    }

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: req.params.id,
        user_id: userId,
        content,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ comment: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
