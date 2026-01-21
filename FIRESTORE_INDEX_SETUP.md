# Firestore Index Setup

## Quick Setup (Recommended)

The error message provides a direct link to create the index. Click this link:

**https://console.firebase.google.com/v1/r/project/matkisleaderboard/firestore/indexes?create_composite=Ck9wcm9qZWN0cy9tYXRraXNsZWFkZXJib2FyZC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdXNlcnMvaW5kZXhlcy9fEAEaCgoGcmF0aW5nEAIaDAoIdXNlcm5hbWUQARoMCghfX25hbWVfXxAB**

This will automatically create the required composite index.

## Manual Setup

If the link doesn't work, create the index manually:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **matkisleaderboard**
3. Go to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Configure:
   - **Collection ID**: `users`
   - **Fields to index**:
     - Field: `rating` → Order: **Descending**
     - Field: `username` → Order: **Ascending**
6. Click **Create**

## Wait for Index to Build

- The index will take 2-5 minutes to build
- You'll see "Building" status initially
- Once it shows "Enabled", the queries will work

## Verify Index

After the index is built, test again:

```bash
curl "http://localhost:8888/.netlify/functions/getLeaderboard?page=1&limit=10"
```

You should get a successful response with leaderboard data.
