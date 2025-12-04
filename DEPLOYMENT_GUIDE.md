# Backend Deployment Guide

## Deploy Backend to Render.com

Your backend needs to be deployed separately from the frontend. Here's how:

### Step 1: Prepare for Deployment

1. **Create a Render account**: Go to [render.com](https://render.com) and sign up
2. **Connect your GitHub**: Link your madhavcodeer/smartwarex repository

### Step 2: Create Web Service on Render

1. Click "New +" → "Web Service"
2. Select your `madhavcodeer/smartwarex` repository
3. Configure the service:

```
Name: smartwarex-backend
Region: Choose closest to your users
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Add Environment Variables

Add these environment variables in Render dashboard:

```
DATABASE_URL=<your-postgres-url>
SECRET_KEY=<generate-a-secure-random-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
CORS_ORIGINS=https://your-netlify-app.netlify.app
```

### Step 4: Deploy

Click "Create Web Service" - Render will automatically deploy your backend!

Your backend URL will be: `https://smartwarex-backend.onrender.com`

---

## Update Frontend to Use Deployed Backend

### Option A: Environment Variable (Recommended)

1. Create `.env` file in `frontend/`:

```env
VITE_API_URL=https://smartwarex-backend.onrender.com
```

2. Update your API calls to use:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.post(`${API_URL}/api/v1/vision/scan`, formData);
```

3. Add environment variable in Netlify:
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://smartwarex-backend.onrender.com`

### Option B: Netlify Redirects (Alternative)

Update `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://smartwarex-backend.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Alternative: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `madhavcodeer/smartwarex`
4. Set root directory to `backend`
5. Railway auto-detects Python and deploys!

---

## Alternative: Deploy to Heroku

```bash
cd backend
heroku create smartwarex-backend
heroku buildpacks:set heroku/python
git push heroku main
```

---

## Quick Fix for Testing

If you just want to test locally with Netlify dev:

```bash
cd frontend
netlify dev
```

This will proxy API requests to your local backend automatically.

---

## Current Issue

❌ **Problem**: Frontend is deployed on Netlify, but backend is only running locally
✅ **Solution**: Deploy backend to Render/Railway/Heroku and update frontend API URL

The error "Failed to analyze image" happens because the frontend can't reach the backend API.
