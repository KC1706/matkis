# Matkis Leaderboard System

A scalable leaderboard system with search functionality, built with Firebase (Cloud Functions + Firestore) and React Native (Expo), deployed to Netlify.

## Features

- **Scalable Leaderboard**: Handles 10,000+ users with capacity for millions
- **Tie-Aware Ranking**: Users with the same rating share the same rank
- **Fast Search**: Prefix-based user search with instant results
- **Live Updates**: Polling mechanism for real-time leaderboard updates
- **Cross-Platform**: React Native app works on iOS, Android, and Web

## Architecture

### Backend (Netlify Functions + Firebase)
- **Netlify Functions**: Serverless functions for API endpoints
- **Firestore**: NoSQL database for user data (Firebase)
- **Tie-Aware Ranking**: Efficient rank calculation using Firestore queries

### Frontend (React Native/Expo)
- **Leaderboard Screen**: Paginated list with polling
- **Search Screen**: Debounced prefix search
- **Optimized Performance**: Virtualized lists, efficient queries

## Quick Start

### Prerequisites
- Node.js 18+
- Netlify CLI: `npm install -g netlify-cli` (optional, can use web interface)
- Firebase account (for Firestore database)

### Backend Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database (test mode)
   - Go to Project Settings → Service Accounts
   - Generate new private key (download JSON)

2. **Set Up Firestore Indexes:**
   - In Firebase Console → Firestore → Indexes
   - Create composite index:
     - Collection: `users`
     - Fields: `rating` (Descending), `username` (Ascending)

3. **Configure Environment Variables:**
   - Extract from Firebase service account JSON:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_CLIENT_EMAIL`
     - `FIREBASE_PRIVATE_KEY` (keep newlines as `\n`)

4. **Install Dependencies:**
```bash
cd netlify
npm install
```

5. **Seed Data (after deployment):**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/seedUsers \
  -H "Content-Type: application/json" \
  -d '{"numUsers": 10000}'
```

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend
npm install
```

2. **Configure API URL:**
Create `frontend/.env`:
```
EXPO_PUBLIC_API_URL=https://us-central1-your-project.cloudfunctions.net
```

3. **Run Locally:**
```bash
npm start
# Press 'w' for web, 'i' for iOS, 'a' for Android
```

4. **Build for Web:**
```bash
npm run build:web
```

5. **Deploy to Netlify:**
```bash
netlify deploy --prod
```

## API Endpoints

### Get Leaderboard
```
GET /.netlify/functions/getLeaderboard?page=1&limit=50
```

**Response:**
```json
{
  "data": [
    {
      "rank": 1,
      "username": "brandon",
      "rating": 5000,
      "user_id": "123"
    }
  ],
  "page": 1,
  "limit": 50
}
```

### Search Users
```
GET /.netlify/functions/searchUsers?q=rahul
```

**Response:**
```json
{
  "data": [
    {
      "global_rank": 200,
      "username": "rahul",
      "rating": 4600
    },
    {
      "global_rank": 800,
      "username": "rahul_burman",
      "rating": 3900
    }
  ]
}
```

### Seed Users
```
POST /.netlify/functions/seedUsers
Body: {"numUsers": 10000}
```

## Project Structure

```
matkis_assignment/
├── netlify/                # Netlify Functions
│   ├── functions/
│   │   ├── getLeaderboard.ts
│   │   ├── searchUsers.ts
│   │   ├── seedUsers.ts
│   │   └── utils/
│   │       └── ranking.ts
│   └── package.json
├── frontend/               # React Native Expo app
│   ├── app/
│   │   ├── leaderboard.tsx
│   │   ├── search.tsx
│   │   └── _layout.tsx
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── package.json
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── TESTING_GUIDE.md
```

## Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.

## Deployment

### Backend (Netlify Functions)
- Functions deploy automatically with Netlify
- Set environment variables in Netlify dashboard:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
- Firestore indexes must be created in Firebase Console

### Frontend (Netlify)
- Build command: `npm run build:web`
- Publish directory: `.expo/web`
- Functions directory: `netlify/functions`
- Environment variable: `EXPO_PUBLIC_API_URL` (optional, defaults to relative paths)

## Performance

- **Leaderboard Load**: < 3 seconds for 10k+ users
- **Search Response**: < 500ms
- **Polling Interval**: 3 seconds
- **Debounce Delay**: 300ms

## Free Tier Limits

### Firebase
- Firestore: 50K reads/day, 20K writes/day
- Cloud Functions: 2M invocations/month

### Netlify
- 100 GB bandwidth/month
- 300 build minutes/month

## License

MIT
