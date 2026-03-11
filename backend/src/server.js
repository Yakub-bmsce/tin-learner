require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const roadmapRoutes = require('./routes/roadmap');
const quizRoutes = require('./routes/quiz');
const mentorRoutes = require('./routes/mentor');
const communityRoutes = require('./routes/community');
const userRoutes = require('./routes/user');
const domainRoutes = require('./routes/domain');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

// CORS configuration - allow all origins for now
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: 'Too many requests, please try again later.',
});

app.use('/api', limiter);

// Routes
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/domain', domainRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 TinLearn Backend running on port ${PORT}`);
});
