const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateContent = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    
    return {
      response: {
        text: () => completion.choices[0].message.content
      }
    };
  } catch (error) {
    console.error('Groq API Error:', error.message);
    throw error;
  }
};

const generateContentStream = async (prompt) => {
  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      stream: true,
    });
    
    return {
      stream: (async function* () {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            yield { text: () => content };
          }
        }
      })()
    };
  } catch (error) {
    console.error('Groq Streaming Error:', error.message);
    throw error;
  }
};

const model = {
  generateContent,
  generateContentStream
};

module.exports = { model };
