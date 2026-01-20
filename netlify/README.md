# Netlify Functions

Serverless functions for the leaderboard API using Firebase Firestore.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (in Netlify Dashboard):
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

3. Functions are automatically deployed with Netlify.

## Functions

### getLeaderboard
- **Path**: `/.netlify/functions/getLeaderboard`
- **Method**: GET
- **Query Params**: `page` (default: 1), `limit` (default: 50, max: 100)
- **Returns**: Leaderboard entries with tie-aware ranking

### searchUsers
- **Path**: `/.netlify/functions/searchUsers`
- **Method**: GET
- **Query Params**: `q` (required, username prefix)
- **Returns**: Matching users with global ranks

### seedUsers
- **Path**: `/.netlify/functions/seedUsers`
- **Method**: POST
- **Body**: `{"numUsers": 10000}`
- **Returns**: Success message with count

## Local Development

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally
netlify dev
```

Functions will be available at `http://localhost:8888/.netlify/functions/`

## Build

TypeScript is compiled automatically by Netlify during deployment.

To build manually:
```bash
npm run build
```
