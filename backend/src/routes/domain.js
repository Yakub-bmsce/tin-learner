const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini');

// Generate domain content (concepts, quiz, exercises, projects)
router.post('/generate-content', async (req, res) => {
  const { domainName, domainId } = req.body;

  console.log('🔥 Generating content for:', domainName);

  try {
    const prompt = `You are an expert educator creating comprehensive learning content for ${domainName}. Generate detailed, in-depth educational content that will help students master this domain from beginner to advanced level.

Return a JSON object with this exact structure:

{
  "concepts": [
    {
      "title": "Concept title",
      "description": "Comprehensive explanation with examples, use cases, and real-world applications (5-7 sentences minimum). Include why it's important and how it connects to other concepts."
    }
  ],
  "quiz": [
    {
      "question": "Detailed question that tests deep understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Thorough explanation of why this answer is correct and why others are wrong (3-4 sentences)"
    }
  ],
  "exercises": [
    {
      "title": "Exercise title",
      "description": "Detailed step-by-step instructions, learning objectives, expected outcomes, and tips for success (4-5 sentences)",
      "difficulty": "Beginner|Intermediate|Advanced"
    }
  ],
  "projects": [
    {
      "title": "Project title",
      "description": "Comprehensive project description including objectives, features to build, technologies to use, learning outcomes, and implementation guidance (6-8 sentences)",
      "duration": "2-3 weeks",
      "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
    }
  ]
}

Generate:
- 8 fundamental concepts (cover basics to advanced topics)
- 15 quiz questions (mix of easy, medium, and hard difficulty)
- 8 hands-on exercises (progressive difficulty)
- 5 real-world project ideas (from simple to complex)

Make content:
- Highly detailed and educational
- Include practical examples and use cases
- Progressive from beginner to advanced
- Industry-relevant and modern
- Engaging and motivating for learners`;

    console.log('📡 Calling AI API...');
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log('✅ Got response from AI');
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const content = JSON.parse(jsonMatch[0]);
      console.log('✅ Content generated successfully');
      res.json({ content });
    } else {
      console.error('❌ Failed to parse JSON from response');
      throw new Error('Failed to parse domain content');
    }
  } catch (error) {
    console.error('❌ Error generating domain content:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
