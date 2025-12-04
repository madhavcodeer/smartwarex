# Quick Fix for "Failed to analyze image" Error

## Problem
Your Netlify deployment shows "Failed to analyze image. Please try again." because:
- ❌ Frontend is deployed on Netlify
- ❌ Backend is only running locally (localhost:8000)
- ❌ Netlify can't reach your local backend

## Solution: Deploy Your Backend

### Option 1: Deploy to Render.com (Recommended - Free Tier Available)

#### Step 1: Sign up and Connect
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize access to your repositories

#### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your `madhavcodeer/smartwarex` repository
3. Configure:
   - **Name**: `smartwarex-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### Step 3: Add Environment Variables
Click "Advanced" and add:
```
SECRET_KEY=your-super-secret-key-here-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
```

#### Step 4: Deploy
Click "Create Web Service" - wait 5-10 minutes for deployment

You'll get a URL like: `https://smartwarex-backend.onrender.com`

#### Step 5: Update Netlify Configuration
1. Open `netlify.toml` in your project
2. Find this line:
   ```toml
   to = "https://YOUR_BACKEND_URL.onrender.com/api/:splat"
   ```
3. Replace with your actual Render URL:
   ```toml
   to = "https://smartwarex-backend.onrender.com/api/:splat"
   ```
4. Commit and push:
   ```bash
   git add netlify.toml
   git commit -m "Update backend URL for production"
   git push origin main
   ```

Netlify will automatically redeploy with the new configuration!

---

### Option 2: Use Environment Variable (Alternative)

#### Step 1: Create `.env` file
In `frontend/` directory:
```env
VITE_API_URL=https://smartwarex-backend.onrender.com
```

#### Step 2: Add to Netlify
1. Go to Netlify Dashboard
2. Site settings → Environment variables
3. Add: `VITE_API_URL` = `https://smartwarex-backend.onrender.com`
4. Trigger redeploy

---

### Option 3: Test Locally First

If you want to test everything locally before deploying:

```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend with Netlify Dev
cd frontend
npm install netlify-cli -g
netlify dev
```

This will run your frontend on `http://localhost:8888` and proxy API calls to your local backend.

---

## Files Created/Updated

✅ `frontend/src/config/api.ts` - Centralized API configuration
✅ `frontend/.env.example` - Environment variable template  
✅ `backend/Procfile` - Deployment configuration
✅ `netlify.toml` - Updated with API proxy
✅ `DEPLOYMENT_GUIDE.md` - Full deployment instructions

## Next Steps

1. **Deploy backend to Render** (5-10 minutes)
2. **Update `netlify.toml`** with your backend URL
3. **Push to GitHub** - Netlify auto-deploys
4. **Test the scanner** - Should work now! 🎉

## Need Help?

- Render deployment issues: Check Render logs
- Netlify issues: Check Netlify deploy logs
- API errors: Check browser console (F12)

---

## Current Status

✅ Frontend code updated to use centralized API config
✅ Netlify config ready (just need backend URL)
✅ Backend ready for deployment
⏳ Waiting for backend deployment
⏳ Waiting for netlify.toml update with backend URL
