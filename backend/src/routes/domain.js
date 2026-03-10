const express = require('express');
const router = express.Router();
const { model } = require('../config/gemini');

// Generate domain content (concepts, quiz, exercises, projects)
router.post('/generate-content', async (req, res) => {
  const { domainName, domainId } = req.body;

  console.log('🔥 Generating content for:', domainName);

  try {
    const prompt = `Generate educational content for ${domainName} in valid JSON format.

Return exactly this structure with 5 concepts, 8 quiz questions, 5 exercises, and 3 projects:

{"concepts":[{"title":"Concept Name","description":"Brief explanation in 2-3 sentences"}],"quiz":[{"question":"Question text","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Why this is correct"}],"exercises":[{"title":"Exercise Name","description":"What to practice","difficulty":"Beginner"}],"projects":[{"title":"Project Name","description":"What to build","duration":"2 weeks","skills":["Skill1","Skill2"]}]}

Keep descriptions simple and avoid special characters.`;

    console.log('📡 Calling AI API...');
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    console.log('✅ Got response from AI');
    
    // Aggressive cleaning
    response = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/[\r\n\t]/g, ' ')
      .trim();
    
    // Extract JSON
    const jsonMatch = response.match(/\{.*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found, using fallback');
      return res.json({ content: getFallbackContent(domainName) });
    }
    
    let jsonStr = jsonMatch[0];
    
    // Remove all backslashes except those before quotes
    jsonStr = jsonStr.replace(/\\(?!")/g, '');
    
    try {
      const content = JSON.parse(jsonStr);
      
      // Validate structure
      if (!content.concepts || !content.quiz || !content.exercises || !content.projects) {
        throw new Error('Invalid content structure');
      }
      
      console.log('✅ Content parsed successfully');
      res.json({ content });
    } catch (parseError) {
      console.error('❌ JSON parse failed, using fallback:', parseError.message);
      res.json({ content: getFallbackContent(domainName) });
    }
  } catch (error) {
    console.error('❌ Error generating content, using fallback:', error.message);
    res.json({ content: getFallbackContent(domainName) });
  }
});

// Fallback content generator
function getFallbackContent(domainName) {
  return {
    concepts: [
      {
        title: `Introduction to ${domainName}`,
        description: `${domainName} is a fundamental area of technology that powers modern applications. Understanding its core principles is essential for building robust solutions.`
      },
      {
        title: `Core Principles of ${domainName}`,
        description: `Learn the foundational concepts that make ${domainName} work. These principles apply across different tools and frameworks in this domain.`
      },
      {
        title: `Best Practices in ${domainName}`,
        description: `Industry-standard approaches and patterns used by professionals. Following these practices ensures maintainable and scalable solutions.`
      },
      {
        title: `Tools and Technologies`,
        description: `Explore the ecosystem of tools available for ${domainName}. Each tool serves specific purposes and solves particular problems.`
      },
      {
        title: `Advanced Concepts`,
        description: `Deep dive into advanced topics that separate beginners from experts. These concepts enable you to build sophisticated applications.`
      }
    ],
    quiz: [
      {
        question: `What is the primary purpose of ${domainName}?`,
        options: [
          "To build modern applications",
          "To replace older technologies",
          "To make development easier",
          "To increase performance"
        ],
        correctAnswer: 0,
        explanation: `${domainName} is primarily used to build modern applications with improved capabilities and user experience.`
      },
      {
        question: `Which skill is most important when learning ${domainName}?`,
        options: [
          "Understanding fundamentals",
          "Memorizing syntax",
          "Using the latest tools",
          "Working quickly"
        ],
        correctAnswer: 0,
        explanation: "Understanding fundamentals provides a strong foundation for learning any technology effectively."
      },
      {
        question: `What is a common challenge in ${domainName}?`,
        options: [
          "Managing complexity",
          "Finding resources",
          "Installing software",
          "Writing documentation"
        ],
        correctAnswer: 0,
        explanation: "Managing complexity is a universal challenge that requires good architecture and design patterns."
      },
      {
        question: `How long does it typically take to learn ${domainName} basics?`,
        options: [
          "2-3 months with consistent practice",
          "1 week of intensive study",
          "6-12 months minimum",
          "It depends on background"
        ],
        correctAnswer: 3,
        explanation: "Learning time varies based on prior experience, dedication, and learning approach."
      },
      {
        question: `What is the best way to practice ${domainName}?`,
        options: [
          "Build real projects",
          "Watch video tutorials",
          "Read documentation",
          "Take online courses"
        ],
        correctAnswer: 0,
        explanation: "Building real projects provides hands-on experience and reinforces learning through practice."
      },
      {
        question: `Which resource is most valuable for ${domainName}?`,
        options: [
          "Official documentation",
          "YouTube videos",
          "Blog posts",
          "Social media"
        ],
        correctAnswer: 0,
        explanation: "Official documentation is the most accurate and up-to-date source of information."
      },
      {
        question: `What makes someone proficient in ${domainName}?`,
        options: [
          "Years of experience and practice",
          "Knowing all the syntax",
          "Using advanced features",
          "Working on large projects"
        ],
        correctAnswer: 0,
        explanation: "Proficiency comes from consistent practice and experience solving real-world problems."
      },
      {
        question: `What is the future outlook for ${domainName}?`,
        options: [
          "Growing demand and opportunities",
          "Declining relevance",
          "Stable but not growing",
          "Being replaced by AI"
        ],
        correctAnswer: 0,
        explanation: "Most technology domains continue to grow as digital transformation accelerates globally."
      }
    ],
    exercises: [
      {
        title: "Getting Started Exercise",
        description: "Set up your development environment and create your first simple project. This helps you understand the basic workflow and tools.",
        difficulty: "Beginner"
      },
      {
        title: "Core Concepts Practice",
        description: "Work through exercises that reinforce fundamental concepts. Focus on understanding rather than memorization.",
        difficulty: "Beginner"
      },
      {
        title: "Intermediate Challenge",
        description: "Build a small feature that combines multiple concepts. This exercise tests your ability to integrate different ideas.",
        difficulty: "Intermediate"
      },
      {
        title: "Problem Solving Exercise",
        description: "Solve common problems that developers face in this domain. Learn debugging and troubleshooting techniques.",
        difficulty: "Intermediate"
      },
      {
        title: "Advanced Implementation",
        description: "Implement an advanced feature using best practices. This exercise prepares you for real-world development.",
        difficulty: "Advanced"
      }
    ],
    projects: [
      {
        title: `Beginner ${domainName} Project`,
        description: "Build a simple but complete project that demonstrates core concepts. This project will help you understand the basics and give you confidence to tackle more complex challenges.",
        duration: "1-2 weeks",
        skills: ["Fundamentals", "Basic Tools", "Problem Solving"]
      },
      {
        title: `Intermediate ${domainName} Application`,
        description: "Create a more complex application that integrates multiple features. This project will challenge you to apply best practices and design patterns while building something useful.",
        duration: "3-4 weeks",
        skills: ["Architecture", "Best Practices", "Testing", "Deployment"]
      },
      {
        title: `Advanced ${domainName} System`,
        description: "Design and build a production-ready system that solves a real problem. This capstone project will demonstrate your mastery and can be showcased in your portfolio.",
        duration: "6-8 weeks",
        skills: ["System Design", "Scalability", "Security", "Performance", "DevOps"]
      }
    ]
  };
}

module.exports = router;
