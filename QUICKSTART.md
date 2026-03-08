# TinLearn Quick Start Guide

## The red errors you're seeing are normal!

The TypeScript errors in the editor are expected because the dependencies haven't been installed yet. They will disappear once you complete the setup.

## Step 1: Set Up Environment Variables

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### Backend Environment Variables

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## Step 2: Set Up Supabase Database

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Wait for the database to be ready (2-3 minutes)
4. Go to the SQL Editor in your Supabase dashboard
5. Copy the entire contents of `database/schema.sql`
6. Paste it into the SQL Editor
7. Click "Run" to execute the SQL
8. Your database is now set up with all tables and demo data!

## Step 3: Get Your API Keys

### Supabase Keys (Required)
1. In your Supabase project, go to Settings > API
2. Copy the "Project URL" → This is your `SUPABASE_URL`
3. Copy the "anon public" key → This is your `SUPABASE_ANON_KEY`
4. Copy the "service_role" key → This is your `SUPABASE_SERVICE_ROLE_KEY`

### Google Gemini API Key (Required)
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Sign in with your Google account
4. Create a new API key
5. Copy the key → This is your `GEMINI_API_KEY`

### OAuth Keys (Optional for now - you can add later)
You can skip GitHub and Google OAuth for now and add them later. The app will work without them for testing.

## Step 4: Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see: `🚀 TinLearn Backend running on port 4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see: `Ready on http://localhost:3000`

## Step 5: Open the App

Open your browser and go to: http://localhost:3000

You should see the beautiful TinLearn landing page!

## Troubleshooting

### "Cannot find module" errors still showing?
- Restart your code editor
- Wait a few seconds for TypeScript to recompile
- The errors should disappear once the dev servers are running

### Backend won't start?
- Make sure you created the `.env` file in the backend directory
- Check that your Gemini API key is valid
- Make sure port 4000 is not already in use

### Frontend won't start?
- Make sure you created the `.env.local` file in the frontend directory
- Check that your Supabase URL and keys are correct
- Make sure port 3000 is not already in use

### Database errors?
- Make sure you ran the SQL schema in Supabase
- Check that your Supabase service role key is correct
- Verify your Supabase project is active

## What to Test First

1. **Landing Page** - Should load with beautiful neon design
2. **Domain Cards** - Hover over them to see animations
3. **Without OAuth** - You can test the UI, but won't be able to log in yet
4. **With OAuth** - Set up Google/GitHub OAuth to test full functionality

## Next Steps

Once everything is running:
1. Set up OAuth (see DEPLOYMENT.md for detailed instructions)
2. Test creating a roadmap
3. Try the AI mentor chat
4. Explore all 10 domains
5. Check out the community features

## Need Help?

- Check `README.md` for detailed setup instructions
- Check `DEPLOYMENT.md` for production deployment
- Make sure all environment variables are set correctly
- Verify your API keys are valid and have proper permissions

## Common Issues on Windows

If you're on Windows and see path errors:
- Use PowerShell or Command Prompt (not Git Bash)
- Make sure Node.js is properly installed
- Try running as Administrator if you get permission errors

Enjoy building with TinLearn! 🚀
