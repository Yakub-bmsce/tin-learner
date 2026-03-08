# TinLearn Deployment Guide

## Prerequisites

1. Supabase account (https://supabase.com)
2. Google Cloud account for Gemini API (https://ai.google.dev)
3. GitHub OAuth App (https://github.com/settings/developers)
4. Google OAuth credentials (https://console.cloud.google.com)
5. Vercel account (https://vercel.com)
6. Railway account (https://railway.app)

## Step 1: Database Setup (Supabase)

1. Create a new Supabase project
2. Go to SQL Editor
3. Copy and paste the entire contents of `database/schema.sql`
4. Execute the SQL to create all tables, policies, and functions
5. Go to Authentication > Providers
6. Enable Google OAuth and GitHub OAuth
7. Add your OAuth credentials
8. Set redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.vercel.app/auth/callback`

## Step 2: Get API Keys

### Gemini API Key
1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: TinLearn
   - Homepage URL: `http://localhost:3000` (dev) or your production URL
   - Authorization callback URL: `http://localhost:3000/auth/callback`
4. Copy Client ID and Client Secret

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Configure consent screen
6. Create Web application credentials
7. Add authorized redirect URIs: `http://localhost:3000/auth/callback`
8. Copy Client ID and Client Secret

## Step 3: Local Development Setup

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your actual values
npm install
npm run dev
```

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your actual values
npm install
npm run dev
```

Visit http://localhost:3000

## Step 4: Deploy Backend (Railway)

1. Push your code to GitHub
2. Go to https://railway.app
3. Click "New Project" > "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the backend
6. Add environment variables:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - GEMINI_API_KEY
   - PORT (Railway will set this automatically)
   - FRONTEND_URL (your Vercel URL after deployment)
7. Deploy
8. Copy the generated Railway URL (e.g., `https://your-app.railway.app`)

## Step 5: Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
5. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXTAUTH_SECRET (generate with `openssl rand -base64 32`)
   - GITHUB_CLIENT_ID
   - GITHUB_CLIENT_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NEXT_PUBLIC_BACKEND_URL (your Railway URL)
6. Deploy
7. Copy your Vercel URL

## Step 6: Update OAuth Redirect URLs

### Supabase
1. Go to Authentication > URL Configuration
2. Add your Vercel URL to Site URL
3. Add redirect URL: `https://your-vercel-url.vercel.app/auth/callback`

### GitHub OAuth
1. Go to your OAuth App settings
2. Update Homepage URL and Authorization callback URL with your Vercel URL

### Google OAuth
1. Go to your OAuth credentials
2. Add your Vercel URL to Authorized JavaScript origins
3. Add callback URL to Authorized redirect URIs

## Step 7: Update Backend CORS

In Railway, update the FRONTEND_URL environment variable to your Vercel URL.

## Step 8: Test Production

1. Visit your Vercel URL
2. Test OAuth login with Google and GitHub
3. Create a roadmap
4. Test all features

## Monitoring

### Vercel
- View deployment logs in Vercel dashboard
- Monitor function execution times
- Check analytics

### Railway
- View backend logs in Railway dashboard
- Monitor resource usage
- Check API response times

### Supabase
- Monitor database queries in Supabase dashboard
- Check auth logs
- Review API usage

## Troubleshooting

### OAuth not working
- Verify redirect URLs match exactly
- Check that OAuth credentials are correct
- Ensure Supabase auth providers are enabled

### API errors
- Check Railway logs for backend errors
- Verify environment variables are set correctly
- Ensure Gemini API key is valid and has quota

### Database errors
- Verify RLS policies are set up correctly
- Check that SQL functions were created
- Ensure service role key has proper permissions

## Performance Optimization

1. Enable Vercel Edge Functions for faster response times
2. Use Vercel Image Optimization for avatars
3. Enable Railway autoscaling for backend
4. Set up Supabase connection pooling
5. Add Redis caching layer (optional)

## Security Checklist

- [ ] All environment variables are set
- [ ] OAuth redirect URLs are whitelisted
- [ ] Supabase RLS policies are enabled
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] API keys are not exposed in frontend code
- [ ] HTTPS is enforced on all endpoints

## Cost Estimates

- Supabase: Free tier (up to 500MB database, 50,000 monthly active users)
- Vercel: Free tier (100GB bandwidth, unlimited deployments)
- Railway: $5/month (512MB RAM, 1GB storage)
- Google Gemini API: Free tier (60 requests per minute)

Total: ~$5/month for small to medium traffic

## Scaling Considerations

When you reach limits:
1. Upgrade Supabase to Pro ($25/month) for more database capacity
2. Upgrade Vercel to Pro ($20/month) for more bandwidth
3. Scale Railway resources as needed
4. Consider implementing caching with Redis
5. Add CDN for static assets
