import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  full_name: string;
  college: string;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  preferred_language: 'English' | 'Hindi' | 'Kannada' | 'Malayalam' | 'Telugu';
  xp_points: number;
  streak_count: number;
  last_activity_date: string;
  avatar_url?: string;
  created_at: string;
};

export type Roadmap = {
  id: string;
  user_id: string;
  domain: string;
  goal_input: string;
  generated_at: string;
};

export type RoadmapModule = {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  translated_description?: string;
  order_index: number;
  estimated_hours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resources: Array<{
    title: string;
    type: string;
    url: string;
  }>;
  mini_project?: {
    title: string;
    description: string;
    expected_output: string;
  };
  completed: boolean;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  domain_tag: string;
  likes_count: number;
  created_at: string;
  users?: User;
};

export type Badge = {
  id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
};
