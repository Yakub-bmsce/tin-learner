const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini');
const supabase = require('../config/supabase');

// Generate quiz
router.post('/generate', async (req, res) => {
  const { domain, level, language } = req.body;

  try {
    const prompt = `Generate 20 quiz questions for ${domain} at ${level} level. Return JSON array. Each item: question, options (array of 4 strings), correct_answer (0-3 index), explanation. ${language !== 'English' ? `Add translated_question field in ${language}.` : ''}

Example format:
[
  {
    "question": "What is React?",
    "translated_question": "${language !== 'English' ? 'Translation here' : ''}",
    "options": ["A library", "A framework", "A language", "A database"],
    "correct_answer": 0,
    "explanation": "React is a JavaScript library for building user interfaces."
  }
]`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      res.json({ questions });
    } else {
      throw new Error('Failed to parse quiz questions');
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz
router.post('/submit', async (req, res) => {
  const { userId, domain, score, totalQuestions } = req.body;

  try {
    if (!supabase) {
      return res.json({ success: true });
    }

    await supabase.from('quiz_attempts').insert({
      user_id: userId,
      domain,
      score,
      total_questions: totalQuestions,
    });

    // Award XP
    await supabase.rpc('increment_xp', { user_id: userId, amount: 100 });

    // Check for Quiz Master badge (90%+)
    if (score / totalQuestions >= 0.9) {
      const { data: existingBadge } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_name', 'Quiz Master')
        .single();

      if (!existingBadge) {
        await supabase.from('user_badges').insert({
          user_id: userId,
          badge_name: 'Quiz Master',
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
