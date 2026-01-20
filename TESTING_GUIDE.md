# Step-by-Step Testing Guide

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Netlify CLI installed: `npm install -g netlify-cli` (optional, can use web interface)
- Firebase account
- Netlify account

## Phase 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "matkis-leaderboard")
4. Disable Google Analytics (optional for free tier)
5. Click "Create project"

### 1.2 Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location (e.g., `us-central1`)
5. Click "Enable"

### 1.3 Get Firebase Service Account Credentials

1. In Firebase Console, go to "Project Settings"
2. Click "Service Accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Note the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## Phase 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd netlify
npm install
```

### 2.2 Create Firestore Indexes

1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Collection ID: `users`
4. Fields:
   - `rating` - Descending
   - `username` - Ascending
5. Click "Create"

Wait for index to build (may take a few minutes).

### 2.3 Configure Environment Variables (for Netlify)

After deploying to Netlify, set these in Netlify Dashboard:
- Go to Site settings → Environment variables
- Add:
  - `FIREBASE_PROJECT_ID` = (from service account JSON)
  - `FIREBASE_CLIENT_EMAIL` = (from service account JSON)
  - `FIREBASE_PRIVATE_KEY` = (from service account JSON, keep `\n` as literal)

### 2.4 Seed Data (after deployment)

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/seedUsers \
  -H "Content-Type: application/json" \
  -d '{"numUsers": 10000}'
```

Wait for completion (may take 5-10 minutes for 10,000 users).

## Phase 3: Backend Testing

### 3.1 Test Leaderboard Endpoint

```bash
curl "https://your-site.netlify.app/.netlify/functions/getLeaderboard?page=1&limit=10"
```

**Verify:**
- Returns array of users
- Each user has: `rank`, `username`, `rating`, `user_id`
- Ranks are tie-aware (users with same rating share rank)
- Pagination works

### 3.2 Test Search Endpoint

```bash
curl "https://your-site.netlify.app/.netlify/functions/searchUsers?q=rahul"
```

**Verify:**
- Returns all users with username starting with "rahul"
- Each result has: `global_rank`, `username`, `rating`
- Results are sorted by rank

### 3.3 Test Edge Cases

```bash
# Empty search
curl "https://your-site.netlify.app/.netlify/functions/searchUsers?q="

# Non-existent user
curl "https://your-site.netlify.app/.netlify/functions/searchUsers?q=xyz123"

# Large page number
curl "https://your-site.netlify.app/.netlify/functions/getLeaderboard?page=1000&limit=50"
```

## Phase 4: Frontend Setup

### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

### 4.2 Configure API URL

Create `frontend/.env`:
```
EXPO_PUBLIC_API_URL=https://us-central1-your-project.cloudfunctions.net
```

Replace `your-project` with your actual Firebase project ID.

### 4.3 Test Locally (Web)

```bash
npm start
# Press 'w' for web
```

Open browser to `http://localhost:8081` (or the URL shown)

### 4.4 Test Leaderboard Screen

**Verify:**
- [ ] Top 50 users display
- [ ] Rank, Username, Rating shown correctly
- [ ] Pull-to-refresh works
- [ ] Pagination loads more users
- [ ] Polling updates every 3 seconds
- [ ] Loading states appear
- [ ] Error handling works

### 4.5 Test Search Screen

**Verify:**
- [ ] Search input works
- [ ] Debouncing prevents excessive calls (300ms delay)
- [ ] Prefix search finds matching users
- [ ] Results show: Global Rank | Username | Rating
- [ ] Multiple results display correctly
- [ ] Empty state shows when no results
- [ ] Loading indicator appears during search

### 4.6 Test Navigation

**Verify:**
- [ ] Can switch between Leaderboard and Search tabs
- [ ] State persists when switching tabs
- [ ] No crashes or errors

## Phase 5: Frontend Deployment (Netlify)

### 5.1 Set Environment Variables in Netlify

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Add:
   - `FIREBASE_PROJECT_ID` = (from service account JSON)
   - `FIREBASE_CLIENT_EMAIL` = (from service account JSON)
   - `FIREBASE_PRIVATE_KEY` = (from service account JSON, keep `\n` as literal)
   - `EXPO_PUBLIC_API_URL` = (optional, defaults to relative paths)

### 5.2 Deploy to Netlify

**Option A: Using Netlify CLI**

```bash
netlify login
netlify init
# Follow prompts:
# - Create & configure a new site
# - Team: Select your team
# - Site name: (optional, auto-generated)
# - Build command: cd netlify && npm install && cd ../frontend && npm install && npm run build:web
# - Directory to deploy: frontend/.expo/web
# - Functions directory: netlify/functions

netlify deploy --prod
```

**Option B: Using Netlify Web Interface**

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository (or drag & drop)
4. Configure build settings:
   - Build command: `cd netlify && npm install && cd ../frontend && npm install && npm run build:web`
   - Publish directory: `frontend/.expo/web`
   - Functions directory: `netlify/functions`
5. Add environment variables (see 5.1)
6. Deploy

### 5.3 Verify Deployment

1. Check Netlify Dashboard → Functions
2. Verify all 3 functions are deployed:
   - `getLeaderboard`
   - `searchUsers`
   - `seedUsers`

## Phase 6: End-to-End Testing

### 6.1 Test Deployed Web App

1. Open your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Verify app loads without errors

### 6.2 Test Leaderboard on Production

**Verify:**
- [ ] Leaderboard loads with real data
- [ ] Users display correctly
- [ ] Pagination works
- [ ] Polling updates work
- [ ] No CORS errors in console

### 6.3 Test Search on Production

**Verify:**
- [ ] Search works with real data
- [ ] Results display correctly
- [ ] Ranks are accurate
- [ ] Multiple matches show (e.g., search "rahul")

### 6.4 Test Performance

**Verify:**
- [ ] Page loads in < 3 seconds
- [ ] Search responds in < 500ms
- [ ] Smooth scrolling with 10k+ users
- [ ] No memory leaks during polling

### 6.5 Test Mobile Responsiveness

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on mobile viewport sizes

**Verify:**
- [ ] Layout adapts to mobile
- [ ] Touch interactions work
- [ ] Text is readable
- [ ] Buttons are tappable

## Phase 7: Load Testing

### 7.1 Test with 10,000+ Users

1. Ensure seed data has 10,000+ users
2. Test leaderboard pagination (page 1, 50, 100, etc.)
3. Verify performance remains acceptable

### 7.2 Monitor Firebase Usage

1. Go to Firebase Console → Usage and billing
2. Check Firestore reads/writes
3. Check Cloud Functions invocations
4. Verify within free tier limits:
   - Firestore: 50K reads/day, 20K writes/day
   - Functions: 2M invocations/month

### 7.3 Test Search Performance

```bash
# Test various search queries
curl "https://us-central1-your-project.cloudfunctions.net/searchUsers?q=a"
curl "https://us-central1-your-project.cloudfunctions.net/searchUsers?q=rahul"
curl "https://us-central1-your-project.cloudfunctions.net/searchUsers?q=z"
```

**Verify:** All queries respond quickly (< 1 second)

## Troubleshooting

### Issue: Functions not deploying

**Solution:**
- Check Firebase CLI is logged in: `firebase login`
- Verify project ID in `.firebaserc`
- Check billing is enabled (required for Functions)

### Issue: CORS errors

**Solution:**
- Verify CORS headers in Cloud Functions
- Check API URL is correct in frontend `.env`
- Ensure functions are deployed

### Issue: Firestore index errors

**Solution:**
- Create composite index in Firebase Console
- Wait for index to build (may take a few minutes)
- Deploy indexes: `firebase deploy --only firestore:indexes`

### Issue: Search not working

**Solution:**
- Verify username field is indexed
- Check query format (prefix matching)
- Test with known usernames from seed data

### Issue: Ranks incorrect

**Solution:**
- Verify tie-aware ranking logic
- Check users with same rating share rank
- Ensure ranking calculation counts higher ratings correctly

## Success Criteria Checklist

- [ ] Backend deployed to Firebase
- [ ] 10,000+ users seeded
- [ ] Leaderboard displays correctly
- [ ] Search works with prefix matching
- [ ] Tie-aware ranking is correct
- [ ] Frontend deployed to Netlify
- [ ] Web app loads and functions correctly
- [ ] Performance is acceptable (< 3s load, < 500ms search)
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All features working in production

## Next Steps

1. Create video demonstration
2. Document any additional features
3. Prepare GitHub repository with README
4. Share deployment links
