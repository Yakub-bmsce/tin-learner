# TinLearn Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Railway or Render account (for backend)
- Supabase project (already set up)
- Groq API key (already obtained)

---

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Backend for Deployment

1. **Ensure backend/package.json has correct start script**:
   ```json
   "scripts": {
     "start": "node src/server.js",
     "dev": "nodemon src/server.js"
   }
   ```

### Step 2: Push Code to GitHub

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TinLearn EdTech Platform"
   ```

2. **Create a new repository on GitHub** (https://github.com/new)
   - Name it: `tinlearn-edtech`
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tinlearn-edtech.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Backend on Railway

1. **Go to Railway** (https://railway.app)
   - Sign up/Login with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `tinlearn-edtech` repository

3. **Configure Backend Service**:
   - Railway will detect the backend folder
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `node src/server.js`

4. **Add Environment Variables**:
   Go to Variables tab and add:
   ```
   SUPABASE_URL=https://efifqfbozmpzoloxifsyk.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWZxZmJvem1wem9sb3hpZnN5ayIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MzI4OTI1MTUsImV4cCI6MjA0ODQ2ODUxNX0.atUBJ31W_svUORAtLR84tVDmm-u3E2Lvo6quoJ1ewKI
   GROQ_API_KEY=your_groq_api_key
   PORT=4001
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Deploy**:
   - Railway will automatically deploy
   - Copy your backend URL (e.g., `https://tinlearn-backend.up.railway.app`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

Make sure your code is pushed to GitHub (done in Part 1).

### Step 2: Deploy to Vercel

1. **Go to Vercel** (https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your `tinlearn-edtech` repository
   - Vercel will detect Next.js

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://efifqfbozmpzoloxifsyk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWZxZmJvem1wem9sb3hpZnN5ayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMyODkyNTE1LCJleHAiOjIwNDg0Njg1MTV9._GvVfVlUt3UJtmyvATffdT0reuwE7lVIQ_lADWumVqU
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
   NEXTAUTH_SECRET=generate_random_string_here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

   **To generate NEXTAUTH_SECRET**, run in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like `https://tinlearn-edtech.vercel.app`

### Step 3: Update Backend CORS

1. **Go back to Railway** and update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://tinlearn-edtech.vercel.app
   ```
   (Replace with your actual Vercel URL)

2. **Redeploy backend** (Railway will auto-redeploy on variable change)

---

## Part 3: Post-Deployment Testing

### Test Checklist:
- [ ] Frontend loads at Vercel URL
- [ ] Backend is accessible at Railway URL
- [ ] Click on a domain - content generates successfully
- [ ] Create a roadmap - AI generates modules
- [ ] Test AI mentor chat
- [ ] Check browser console for errors
- [ ] Test on mobile device

---

## Part 4: Configure Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `tinlearn.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable

### On Railway:
1. Go to Settings → Networking
2. Add custom domain for backend API
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BACKEND_URL` in Vercel

---

## Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. **Go to Render** (https://render.com)
2. **Create New Web Service**:
   - Connect GitHub repository
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Environment**: Node
3. **Add Environment Variables** (same as Railway)
4. **Deploy**
5. Copy Render URL and use it in Vercel's `NEXT_PUBLIC_BACKEND_URL`

---

## Troubleshooting

### Frontend Build Fails on Vercel
- Check Vercel build logs for specific errors
- Verify all dependencies are in `frontend/package.json`
- Ensure environment variables are set correctly
- Try building locally: `cd frontend && npm run build`

### Backend Deployment Fails
- Check Railway/Render logs for errors
- Verify `package.json` has correct start script
- Ensure all environment variables are set
- Test locally: `cd backend && npm start`

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check backend logs for CORS-related errors
- Ensure no trailing slash in URLs

### API Calls Failing (404/500 errors)
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct in Vercel
- Check backend is running: visit `https://your-backend.railway.app`
- Verify Groq API key is valid
- Check Railway logs for API errors

### Content Not Generating
- Verify Groq API key is set correctly
- Check Groq console for rate limits
- Review backend logs for AI API errors
- Test Groq API key directly at https://console.groq.com

---

## Environment Variables Reference

### Backend (Railway/Render):
```env
SUPABASE_URL=https://efifqfbozmpzoloxifsyk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
PORT=4001
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel):
```env
NEXT_PUBLIC_SUPABASE_URL=https://efifqfbozmpzoloxifsyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## Monitoring & Maintenance

### Railway Dashboard:
- Monitor backend logs in real-time
- Check CPU and memory usage
- View deployment history
- Set up usage alerts

### Vercel Dashboard:
- View deployment logs and build times
- Check function execution times
- Monitor bandwidth usage
- Review analytics data

### Supabase Dashboard:
- Monitor database queries and performance
- Check API usage and rate limits
- Review authentication logs
- Track storage usage

### Groq Console:
- Track API usage and requests
- Monitor rate limits
- Check for errors or issues

---

## Cost Breakdown

### Free Tier Limits:
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Railway**: $5 free credit monthly (then ~$5-10/month)
- **Render**: Free tier with 750 hours/month
- **Supabase**: 500MB database, 2GB bandwidth, 50K MAU
- **Groq**: Free tier with generous limits

### Estimated Monthly Cost:
- **Development/Small Scale**: $0-5/month
- **Medium Scale**: $10-20/month
- **Production Scale**: $30-50/month

---

## Performance Optimization Tips

1. **Enable Vercel Edge Functions** for faster API routes
2. **Use Vercel Image Optimization** for profile images
3. **Enable Railway autoscaling** for backend
4. **Implement caching** for frequently accessed data
5. **Use CDN** for static assets
6. **Optimize database queries** in Supabase
7. **Add Redis** for session management (optional)

---

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] API keys are not exposed in frontend code
- [ ] CORS is properly configured
- [ ] HTTPS is enforced on all endpoints
- [ ] Supabase RLS policies are enabled
- [ ] Rate limiting is configured on backend
- [ ] OAuth redirect URLs are whitelisted
- [ ] Database backups are enabled

---

## Next Steps After Deployment

1. ✅ Set up custom domain
2. ✅ Configure SSL certificates (auto on Vercel/Railway)
3. ✅ Set up monitoring and alerts
4. ✅ Configure database backups
5. ✅ Add analytics (Vercel Analytics, Google Analytics)
6. ✅ Set up error tracking (Sentry)
7. ✅ Implement rate limiting
8. ✅ Add user feedback system
9. ✅ Create admin dashboard
10. ✅ Set up CI/CD pipeline

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Groq Docs**: https://console.groq.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 2. Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 3. Test production build locally
cd frontend && npm run build && npm start
cd backend && npm start

# 4. Deploy
# - Go to Railway and deploy backend
# - Go to Vercel and deploy frontend
# - Update environment variables
# - Test live site
```

---

**Deployment Complete! 🚀**

Your TinLearn EdTech platform is now live and ready for students worldwide!
