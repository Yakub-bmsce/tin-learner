const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ leaderboard: [] });
    }

    const { data } = await supabase
      .from('users')
      .select('id, full_name, college, xp_points, avatar_url')
      .order('xp_points', { ascending: false })
      .limit(100);

    res.json({ leaderboard: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Award XP
router.post('/award-xp', async (req, res) => {
  const { userId, amount } = req.body;

  try {
    if (!supabase) {
      return res.json({ success: true });
    }

    await supabase.rpc('increment_xp', { user_id: userId, amount });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Award badge
router.post('/award-badge', async (req, res) => {
  const { userId, badgeName } = req.body;

  try {
    if (!supabase) {
      return res.json({ awarded: true, new: true });
    }

    const { data: existingBadge } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_name', badgeName)
      .single();

    if (!existingBadge) {
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_name: badgeName,
      });
      res.json({ awarded: true, new: true });
    } else {
      res.json({ awarded: false, new: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
