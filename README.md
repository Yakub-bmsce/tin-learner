# TinLearn - AI-Powered EdTech Platform

Your Personalized Tech Learning Path — Built by AI in Seconds

## 🚀 Live Demo

- **Website**: https://tin-learner-frontend.vercel.app
- **Backend API**: https://tin-learner.onrender.com

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Auth**: Supabase Auth with Google OAuth + GitHub OAuth
- **Deploy**: Vercel (frontend), Render (backend)

## Setup Instructions

### 1. Environment Variables

Create `.env.local` in the `frontend` directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

Create `.env` in the `backend` directory:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 2. Database Setup

Run the SQL schema in your Supabase SQL editor (see `database/schema.sql`)

### 3. Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 4. Run Development Servers

```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000

## Features

- 🎯 AI-powered personalized learning roadmaps
- 🌐 Multi-language support (English, Hindi, Kannada, Malayalam, Telugu)
- 🤖 AI Mentor chat with context awareness
- 📊 Gamification with XP, streaks, and badges
- 🏆 Community leaderboard
- 📝 Interactive quizzes and projects
- 💬 Community posts and discussions
- 🎨 Beautiful neon-themed UI with glassmorphism

## Deployment

### Frontend (Vercel)
Deployed at: https://tin-learner-frontend.vercel.app

```bash
cd frontend
vercel
```

### Backend (Render)
Deployed at: https://tin-learner.onrender.com

Connect your GitHub repo to Render and set environment variables.
