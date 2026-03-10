const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini');

// Generate domain content (concepts, quiz, exercises, projects)
router.post('/generate-content', async (req, res) => {
  const { domainName, domainId } = req.body;

  console.log('🔥 Generating content for:', domainName);

  try {
    const prompt = `You are an expert educator creating comprehensive learning content for ${domainName}. 

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no extra text. Just pure JSON.

Generate this exact JSON structure:

{
  "concepts": [
    {
      "title": "Concept title",
      "description": "Comprehensive explanation with examples and use cases (5-7 sentences)"
    }
  ],
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct (2-3 sentences)"
    }
  ],
  "exercises": [
    {
      "title": "Exercise title",
      "description": "Detailed instructions and learning objectives (4-5 sentences)",
      "difficulty": "Beginner"
    }
  ],
  "projects": [
    {
      "title": "Project title",
      "description": "Project description with objectives and features (5-6 sentences)",
      "duration": "2-3 weeks",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ]
}

Generate:
- 6 fundamental concepts
- 10 quiz questions
- 6 hands-on exercises
- 4 project ideas

IMPORTANT: Ensure all JSON is valid. Escape quotes in strings. No trailing commas.`;

    console.log('📡 Calling AI API...');
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    console.log('✅ Got response from AI');
    
    // Clean up response - remove markdown code blocks if present
    response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const content = JSON.parse(jsonMatch[0]);
        console.log('✅ Content generated successfully');
        res.json({ content });
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError.message);
        console.error('Response preview:', response.substring(0, 500));
        
        // Return a fallback error with helpful message
        res.status(500).json({ 
          error: 'AI generated invalid JSON. Please try again.',
          details: parseError.message 
        });
      }
    } else {
      console.error('❌ No JSON found in response');
      throw new Error('Failed to extract JSON from AI response');
    }
  } catch (error) {
    console.error('❌ Error generating domain content:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
