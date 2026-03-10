const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini');
const supabase = require('../config/supabase');

// Chat with AI mentor (streaming)
router.post('/chat', async (req, res) => {
  const { userId, message, roadmapId, moduleTitle, level, domain, language } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Save user message (only for logged-in users)
    if (userId && userId !== 'demo-user' && supabase) {
      await supabase.from('chat_history').insert({
        user_id: userId,
        roadmap_id: roadmapId,
        message,
        role: 'user',
      });
    }

    // Build context
    const userLevel = level || 'Intermediate';
    const userDomain = domain || 'General Tech';
    const userLanguage = language || 'English';
    
    const systemPrompt = `You are TinLearn's friendly AI buddy - think of yourself as a cool older friend who loves tech and makes learning fun!

Student Profile:
- Experience Level: ${userLevel}
- Learning Domain: ${userDomain}
${moduleTitle ? `- Current Module: ${moduleTitle}` : ''}

Your Personality:
- Super friendly and enthusiastic (use emojis! 🚀✨💡)
- Explain things like you're chatting with a friend over coffee
- Use simple words, avoid jargon unless you explain it
- Give real-world examples and analogies
- Keep responses SHORT and conversational (2-3 paragraphs max)
- Use bullet points for lists
- Add encouragement and motivation
- Make jokes and use casual language
- If they're stuck, break it down into tiny steps

Response Style:
- Start with an emoji that matches the topic
- Use "you" and "your" (conversational)
- Add "btw", "basically", "honestly" naturally
- End with a question or next step to keep them engaged
- NO long boring paragraphs - keep it snappy!

Example good response:
"🎨 Oh nice! So you wanna learn CSS? Honestly, it's like being a digital artist!

Think of HTML as the skeleton of your website, and CSS is the clothes, makeup, and style. You're basically telling the browser 'make this button blue and round' or 'put this text in the center'.

Here's the cool part:
• You can change colors, fonts, sizes
• Make things move and animate
• Create responsive designs that work on phones

Wanna try making your first styled button? It's super easy! 💪"`;

    const prompt = `${systemPrompt}\n\nStudent Question: ${message}\n\nYour Fun Response:`;

    const result = await model.generateContentStream(prompt);

    let fullResponse = '';
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
    }

    // Save assistant message (only for logged-in users)
    if (userId && userId !== 'demo-user' && supabase) {
      await supabase.from('chat_history').insert({
        user_id: userId,
        roadmap_id: roadmapId,
        message: fullResponse,
        role: 'assistant',
      });
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error('Error in mentor chat:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to get response' })}\n\n`);
    res.end();
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ history: [] });
    }

    const { data } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: true })
      .limit(50);

    res.json({ history: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
