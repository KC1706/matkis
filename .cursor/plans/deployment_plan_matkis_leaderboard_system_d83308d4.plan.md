---
name: "Deployment Plan: Matkis Leaderboard System"
overview: ""
todos: []
---

# Deployment Plan: Matkis Leaderboard System

## Overview

Deploy the leaderboard system according to assignment requirements:

- **Backend**: Golang (PostgreSQL + Redis) → Railway
- **Frontend Web**: React Native Expo web build → Netlify/Vercel
- **Deliverables**: Deployed web app link, GitHub repository, video demo

## Assignment Requirements

From the assignment:

- "Use expo (for mobile and web app) and deploy the web version on vercel/netlify and share the link"
- Backend must be Golang
- Frontend must be React Native (Expo)
- Must handle 10k+ users
- Must be fully functional with search and leaderboard

## Deployment Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Frontend Web  │  ────>  │  Golang Backend  │
│  (Netlify/Vercel)│         │    (Railway)     │
│   Expo Web Build │         │  PostgreSQL+Redis │
└─────────────────┘         └──────────────────┘
```

## Implementation Plan

### Phase 1: Backend Deployment (Railway)

**Files to update/create:**

- `backend/railway.toml` - Already exists, verify configuration
- `railway.json` - Already exists at root, verify
- `backend/Procfile` - Already exists
- Update `RAILWAY_DEPLOYMENT.md` with final steps

**Steps:**

1. Push code to GitHub repository
2. Create Railway project
3. Add PostgreSQL service
4. Add Redis service
5. Deploy Golang backend service
6. Configure environment variables (use Railway service references)
7. Run database migrations
8. Seed initial data (10,000+ users)
9. Get public backend URL
10. Test backend endpoints

**Key Configuration:**

- Root directory: `backend/`
- Build command: `go build -o server cmd/server/main.go`
- Start command: `./server`
- Port: Railway auto-assigns (use `PORT` env var)

### Phase 2: Frontend Web Deployment (Netlify/Vercel)

**Files to update/create:**

- `netlify.toml` - Update for frontend-only deployment (remove functions)
- `vercel.json` - Create if deploying to Vercel
- `frontend/app.json` - Verify web configuration
- Update `frontend/config/constants.ts` - Use environment variable for production URL
- Create `DEPLOYMENT_FRONTEND.md` - Step-by-step frontend deployment guide

**Netlify Deployment:**

1. Update `netlify.toml`:

   - Build command: `cd frontend && npm install && npm run build:web`
   - Publish directory: `frontend/.expo/web`
   - Remove functions configuration
   - Add redirects for SPA routing

2. Configure environment variables:

   - `EXPO_PUBLIC_API_URL`: Railway backend URL

3. Deploy via:

   - GitHub integration (recommended)
   - Netlify CLI

**Vercel Deployment (Alternative):**

1. Create `vercel.json` with build configuration
2. Set environment variables in Vercel dashboard
3. Deploy via GitHub integration or Vercel CLI

**Files to update:**

- `netlify.toml` - Frontend-only configuration
- `frontend/.env.example` - Add production URL example
- Create `vercel.json` if using Vercel

### Phase 3: Configuration Updates

**Files to update:**

- `frontend/config/constants.ts` - Ensure production URL is used from env var
- `frontend/app.json` - Verify web build settings
- Update `README.md` - Add deployment links section

**Configuration:**

- Frontend reads `EXPO_PUBLIC_API_URL` from environment
- Falls back to localhost for development
- Uses Railway URL in production

### Phase 4: Database Setup in Production

**Steps:**

1. Run migrations on Railway PostgreSQL
2. Seed 10,000+ users using Railway CLI or one-time script
3. Verify data exists and queries work

**Migration Options:**

- Use Railway PostgreSQL console
- Use Railway CLI: `railway run --service backend psql < migrations/schema.sql`
- Create one-time migration script

### Phase 5: Testing & Verification

**Test Checklist:**

- [ ] Backend API accessible at Railway URL
- [ ] Leaderboard endpoint returns data
- [ ] Search endpoint works correctly
- [ ] Frontend web app loads
- [ ] Frontend connects to backend
- [ ] Leaderboard displays correctly
- [ ] Search functionality works
- [ ] Tie-aware ranking verified
- [ ] Performance acceptable (10k+ users)

**Test Commands:**

```bash
# Test backend
curl https://your-backend.railway.app/api/leaderboard?page=1&limit=10
curl https://your-backend.railway.app/api/search?q=rahul

# Test frontend
# Open deployed URL in browser
# Test leaderboard and search
```

### Phase 6: Documentation & Deliverables

**Files to create/update:**

- `DEPLOYMENT_COMPLETE.md` - Final deployment summary with links
- Update `README.md` - Add deployment section with live links
- Create deployment checklist

**Deliverables:**

1. GitHub repository (public or private with access)
2. Deployed web app URL (Netlify/Vercel)
3. Backend API URL (Railway)
4. Video demo link (optional but recommended)
5. Deployment documentation

## Technical Details

### Backend Deployment (Railway)

**Environment Variables:**

```
PORT=8080
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
REDIS_ADDR=${{Redis.REDIS_URL}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
REDIS_DB=0
```

**CORS Configuration:**

- Backend already has CORS enabled for all origins
- Verify it works with frontend domain

### Frontend Deployment (Netlify)

**Build Configuration:**

- Command: `cd frontend && npm install && npm run build:web`
- Output: `frontend/.expo/web`
- Environment: `EXPO_PUBLIC_API_URL=https://your-backend.railway.app`

**Netlify.toml Updates:**

- Remove functions configuration
- Update build command
- Keep redirects for SPA routing

### Frontend Deployment (Vercel - Alternative)

**Vercel.json Configuration:**

- Build command
- Output directory
- Environment variables
- Rewrites for SPA routing

## Implementation Order

1. **Prepare GitHub Repository**

   - Ensure all code is committed
   - Push to GitHub
   - Verify repository is accessible

2. **Deploy Backend to Railway**

   - Create Railway project
   - Add databases
   - Deploy backend
   - Run migrations
   - Seed data
   - Get backend URL

3. **Update Frontend Configuration**

   - Update `netlify.toml` for frontend-only
   - Set environment variables
   - Test build locally

4. **Deploy Frontend to Netlify/Vercel**

   - Connect repository
   - Configure build settings
   - Set environment variables
   - Deploy

5. **Test Full Stack**

   - Verify frontend connects to backend
   - Test all functionality
   - Performance testing

6. **Documentation**

   - Update README with links
   - Create deployment summary
   - Document any issues/solutions

## Success Criteria

- ✅ Backend deployed and accessible on Railway
- ✅ Frontend web app deployed and accessible on Netlify/Vercel
- ✅ Frontend successfully connects to backend
- ✅ All features working (leaderboard, search)
- ✅ Handles 10k+ users efficiently
- ✅ Tie-aware ranking works correctly
- ✅ Public URLs available for submission
- ✅ GitHub repository ready for review

## Files to Modify

1. `netlify.toml` - Update for frontend-only deployment
2. `frontend/config/constants.ts` - Already configured, verify
3. `frontend/.env.example` - Add production URL example
4. `DEPLOYMENT_FRONTEND.md` - Create comprehensive guide
5. `DEPLOYMENT_COMPLETE.md` - Create final summary
6. `README.md` - Add deployment links section
7. `vercel.json` - Create if using Vercel (optional)

## Notes

- Railway provides free tier with PostgreSQL and Redis
- Netlify provides free tier for static sites
- Vercel provides free tier for static sites
- Both platforms support environment variables
- CORS is already configured in backend
- Frontend uses environment variables for API URL