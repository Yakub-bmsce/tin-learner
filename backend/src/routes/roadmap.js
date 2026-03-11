const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini');
const supabase = require('../config/supabase');

// Generate roadmap with streaming
router.post('/generate', async (req, res) => {
  const { userId, mode, domain, jobDescription, experienceLevel, language } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const goalInput = mode === 'domain' ? `Learn ${domain}` : jobDescription;
    const actualDomain = mode === 'domain' ? domain : 'Custom Path';
    const level = experienceLevel || 'Intermediate';
    const lang = language || 'English';

    // For demo mode, skip database operations
    const roadmapId = userId ? null : 'demo-roadmap-' + Date.now();

    if (userId && supabase) {
      // Create roadmap entry for logged-in users
      try {
        const { data: roadmapData, error: roadmapError } = await supabase
          .from('roadmaps')
          .insert({
            user_id: userId,
            domain: actualDomain,
            goal_input: goalInput,
          })
          .select()
          .single();

        if (roadmapError) {
          console.error('Supabase error, continuing without DB:', roadmapError);
          res.write(`data: ${JSON.stringify({ roadmapId })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ roadmapId: roadmapData.id })}\n\n`);
        }
      } catch (dbError) {
        console.error('Database connection failed, continuing without DB:', dbError.message);
        res.write(`data: ${JSON.stringify({ roadmapId })}\n\n`);
      }
    } else {
      res.write(`data: ${JSON.stringify({ roadmapId })}\n\n`);
    }

    // Generate roadmap with AI
    const prompt = `You are an expert tech educator. Create a learning roadmap for: ${goalInput}

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no extra text.

Context:
- Domain: ${actualDomain}
- Experience Level: ${level}
- Language: ${lang}

Generate this EXACT JSON structure (ensure all quotes and commas are correct):
{
  "modules": [
    {
      "title": "Module title",
      "level": "Beginner",
      "description": "Detailed description of what students will learn and why it matters",
      "estimated_hours": 15,
      "resources": [
        {
          "title": "Resource name",
          "type": "video",
          "url": "https://example.com",
          "description": "What this covers"
        }
      ],
      "mini_project": {
        "title": "Project name",
        "description": "What to build",
        "expected_output": "What success looks like",
        "skills_practiced": ["Skill 1", "Skill 2"]
      }
    }
  ]
}

Requirements:
- Generate 6-8 modules
- Each module has 3-4 resources
- Progress from basics to advanced
- Include hands-on projects
- Make descriptions motivating and clear
- ENSURE VALID JSON: no trailing commas, proper quotes, valid syntax

Return ONLY the JSON object, nothing else.`;

    const result = await model.generateContentStream(prompt);

    let fullResponse = '';
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
    }

    // Parse and save modules (only for logged-in users)
    if (userId && supabase) {
      try {
        const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const roadmapJson = JSON.parse(jsonMatch[0]);
          
          // Insert modules
          const modulesData = roadmapJson.modules.map((module, index) => ({
            roadmap_id: roadmapId,
            title: module.title,
            description: module.description,
            translated_description: module.translated_description || null,
            order_index: index,
            estimated_hours: module.estimated_hours,
            difficulty: module.level,
            resources: JSON.stringify(module.resources),
            mini_project: JSON.stringify(module.mini_project),
          }));

          await supabase.from('roadmap_modules').insert(modulesData);

          // Award XP and badge
          await supabase.rpc('increment_xp', { user_id: userId, amount: 50 });
          
          const { data: existingBadge } = await supabase
            .from('user_badges')
            .select('*')
            .eq('user_id', userId)
            .eq('badge_name', 'First Roadmap')
            .single();

          if (!existingBadge) {
            await supabase.from('user_badges').insert({
              user_id: userId,
              badge_name: 'First Roadmap',
            });
          }
        }
      } catch (parseError) {
        console.error('Error saving to database (continuing anyway):', parseError.message);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate roadmap' })}\n\n`);
    res.end();
  }
});

// Get roadmap by ID
router.get('/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const { data: roadmap } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', req.params.id)
      .single();

    const { data: modules } = await supabase
      .from('roadmap_modules')
      .select('*')
      .eq('roadmap_id', req.params.id)
      .order('order_index');

    res.json({ roadmap, modules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update module progress
router.post('/:id/progress', async (req, res) => {
  const { userId, moduleId, resourceIndex } = req.body;

  try {
    if (!supabase) {
      return res.json({ success: true }); // Skip in demo mode
    }

    await supabase.from('module_progress').insert({
      user_id: userId,
      module_id: moduleId,
      resource_index: resourceIndex,
    });

    // Award XP
    await supabase.rpc('increment_xp', { user_id: userId, amount: 10 });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
