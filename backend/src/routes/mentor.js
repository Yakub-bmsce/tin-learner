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
    
    const systemPrompt = `You are TinLearn's expert AI mentor - a patient, knowledgeable, and encouraging educator with deep expertise in technology and teaching.

Student Profile:
- Experience Level: ${userLevel}
- Learning Domain: ${userDomain}
${moduleTitle ? `- Current Module: ${moduleTitle}` : ''}
- Preferred Language: ${userLanguage}

Your Teaching Style:
- Provide detailed, comprehensive explanations with real-world examples
- Break down complex concepts into digestible parts
- Include practical code examples with thorough comments
- Encourage critical thinking with follow-up questions
- Share industry best practices and modern approaches
- Be supportive and motivating
- Adapt explanations to the student's level
${userLanguage !== 'English' ? `- Provide response in English first, then translate to ${userLanguage} below, separated by "---"` : ''}

Always aim to:
1. Understand the student's actual question/confusion
2. Provide clear, detailed explanations (not just brief answers)
3. Include practical examples and use cases
4. Suggest next steps or related concepts to explore
5. Encourage hands-on practice`;

    const prompt = `${systemPrompt}\n\nStudent Question: ${message}\n\nYour Detailed Response:`;

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
