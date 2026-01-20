# Deployment Guide

## Quick Deployment Steps

### 1. Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database (test mode)
3. Go to Project Settings → Service Accounts
4. Generate new private key (download JSON)
5. Extract credentials:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 2. Create Firestore Index

1. Firebase Console → Firestore → Indexes
2. Create composite index:
   - Collection: `users`
   - Fields: `rating` (Descending), `username` (Ascending)
3. Wait for index to build (2-5 minutes)

### 3. Netlify Deployment

#### Option A: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (if new)
netlify init

# Set environment variables
netlify env:set FIREBASE_PROJECT_ID "your-project-id"
netlify env:set FIREBASE_CLIENT_EMAIL "your-client-email"
netlify env:set FIREBASE_PRIVATE_KEY "your-private-key"

# Deploy
netlify deploy --prod
```

#### Option B: Deploy via GitHub

1. Push code to GitHub repository
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub repository
5. Configure build settings:
   - Build command: `cd netlify && npm install && cd ../frontend && npm install && npm run build:web`
   - Publish directory: `frontend/.expo/web`
   - Functions directory: `netlify/functions`
6. Add environment variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (keep `\n` as literal newlines)
7. Deploy

### 4. Seed Data

After deployment, seed users:

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/seedUsers \
  -H "Content-Type: application/json" \
  -d '{"numUsers": 10000}'
```

Or use Postman/Insomnia with:
- Method: POST
- URL: `https://your-site.netlify.app/.netlify/functions/seedUsers`
- Body (JSON): `{"numUsers": 10000}`

**Note:** Seeding 10,000 users may take 5-10 minutes. Monitor Netlify function logs.

## Environment Variables

### Required for Netlify Functions

Set these in Netlify Dashboard → Site settings → Environment variables:

- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Service account email
- `FIREBASE_PRIVATE_KEY`: Private key from service account JSON (keep `\n` as literal)

### Optional for Frontend

- `EXPO_PUBLIC_API_URL`: Custom API URL (defaults to relative paths)

## Testing Deployment

### 1. Test Leaderboard

```bash
curl "https://your-site.netlify.app/.netlify/functions/getLeaderboard?page=1&limit=10"
```

### 2. Test Search

```bash
curl "https://your-site.netlify.app/.netlify/functions/searchUsers?q=rahul"
```

### 3. Test Frontend

Open `https://your-site.netlify.app` in browser and verify:
- Leaderboard loads
- Search works
- No console errors

## Troubleshooting

### Functions Not Working

1. Check Netlify function logs: Dashboard → Functions → View logs
2. Verify environment variables are set correctly
3. Ensure Firestore index is created and built
4. Check Firebase service account permissions

### CORS Errors

- Netlify Functions handle CORS automatically
- If issues persist, check function response headers

### Build Failures

1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (18+) in `netlify.toml` or Netlify settings

### Firestore Permission Errors

1. Check Firestore rules (should allow reads)
2. Verify service account has proper permissions
3. Ensure Firestore is enabled in Firebase Console

## Free Tier Limits

### Netlify
- 100 GB bandwidth/month
- 300 build minutes/month
- 125,000 function invocations/month

### Firebase Firestore
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage

## Monitoring

- **Netlify Dashboard**: Function invocations, build logs, errors
- **Firebase Console**: Firestore usage, read/write counts
- **Netlify Function Logs**: Real-time function execution logs
