-- TinLearn Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  college TEXT,
  experience_level TEXT CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  preferred_language TEXT CHECK (preferred_language IN ('English', 'Hindi', 'Kannada', 'Malayalam', 'Telugu')) NOT NULL DEFAULT 'English',
  xp_points INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_activity_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roadmaps table
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  goal_input TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roadmap modules table
CREATE TABLE roadmap_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  translated_description TEXT,
  order_index INTEGER NOT NULL,
  estimated_hours INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  resources JSONB NOT NULL DEFAULT '[]',
  mini_project JSONB,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  domain_tag TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post comments table
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post likes table
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- User badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

-- Chat history table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module progress table
CREATE TABLE module_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES roadmap_modules(id) ON DELETE CASCADE,
  resource_index INTEGER NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id, resource_index)
);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view all profiles for leaderboard" ON users FOR SELECT USING (true);

-- Roadmaps policies
CREATE POLICY "Users can view their own roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own roadmaps" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Roadmap modules policies
CREATE POLICY "Users can view modules of their roadmaps" ON roadmap_modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_modules.roadmap_id AND roadmaps.user_id = auth.uid())
);

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view all badges for leaderboard" ON user_badges FOR SELECT USING (true);

-- Chat history policies
CREATE POLICY "Users can view their own chat history" ON chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat messages" ON chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Module progress policies
CREATE POLICY "Users can view their own progress" ON module_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_roadmap_modules_roadmap_id ON roadmap_modules(roadmap_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_domain_tag ON posts(domain_tag);
CREATE INDEX idx_users_xp_points ON users(xp_points DESC);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);

-- Demo data seeding
INSERT INTO users (id, email, full_name, college, experience_level, preferred_language, xp_points, streak_count, last_activity_date) VALUES
  ('11111111-1111-1111-1111-111111111111', 'demo1@tinlearn.com', 'Arjun Sharma', 'IIT Delhi', 'Intermediate', 'English', 2450, 12, CURRENT_DATE),
  ('22222222-2222-2222-2222-222222222222', 'demo2@tinlearn.com', 'Priya Patel', 'BITS Pilani', 'Advanced', 'Hindi', 3200, 25, CURRENT_DATE),
  ('33333333-3333-3333-3333-333333333333', 'demo3@tinlearn.com', 'Rahul Kumar', 'NIT Trichy', 'Beginner', 'English', 1100, 5, CURRENT_DATE),
  ('44444444-4444-4444-4444-444444444444', 'demo4@tinlearn.com', 'Sneha Reddy', 'VIT Vellore', 'Intermediate', 'Telugu', 1850, 8, CURRENT_DATE),
  ('55555555-5555-5555-5555-555555555555', 'demo5@tinlearn.com', 'Karthik Nair', 'IIIT Bangalore', 'Advanced', 'Malayalam', 2900, 18, CURRENT_DATE);

INSERT INTO user_badges (user_id, badge_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'First Roadmap'),
  ('11111111-1111-1111-1111-111111111111', '7-Day Streak'),
  ('22222222-2222-2222-2222-222222222222', 'First Roadmap'),
  ('22222222-2222-2222-2222-222222222222', 'Quiz Master'),
  ('22222222-2222-2222-2222-222222222222', '7-Day Streak'),
  ('22222222-2222-2222-2222-222222222222', 'Domain Explorer'),
  ('33333333-3333-3333-3333-333333333333', 'First Roadmap'),
  ('44444444-4444-4444-4444-444444444444', 'First Roadmap'),
  ('44444444-4444-4444-4444-444444444444', 'Helpful Human'),
  ('55555555-5555-5555-5555-555555555555', 'First Roadmap'),
  ('55555555-5555-5555-5555-555555555555', '7-Day Streak'),
  ('55555555-5555-5555-5555-555555555555', 'Quiz Master');

INSERT INTO posts (user_id, title, content, domain_tag, likes_count) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Best Resources for Learning React Hooks', 'I recently completed the Web Dev roadmap and wanted to share some amazing resources that helped me master React Hooks. Check out the official React docs, Kent C Dodds blog, and Web Dev Simplified on YouTube!', 'Web Dev', 24),
  ('44444444-4444-4444-4444-444444444444', 'My First ML Model Deployment Journey', 'Just deployed my first machine learning model using Flask and Heroku! The AI roadmap on TinLearn was incredibly helpful. Happy to answer questions!', 'AI', 18),
  ('55555555-5555-5555-5555-555555555555', 'Cybersecurity Tips for Beginners', 'Starting with cybersecurity can be overwhelming. Here are 5 essential concepts every beginner should know: 1. CIA Triad, 2. Encryption basics, 3. Network protocols, 4. Common vulnerabilities, 5. Security tools', 'Cybersecurity', 31),
  ('11111111-1111-1111-1111-111111111111', 'Cloud Computing vs Traditional Hosting', 'Great discussion in my college about cloud vs traditional hosting. TinLearn''s Cloud Computing roadmap really clarified the differences. What are your thoughts?', 'Cloud Computing', 12);


-- SQL Functions for backend operations

-- Increment XP function
CREATE OR REPLACE FUNCTION increment_xp(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET xp_points = xp_points + amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Increment post likes
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET likes_count = likes_count + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Decrement post likes
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET likes_count = GREATEST(likes_count - 1, 0),
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
