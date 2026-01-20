import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { calculateRanksForUsers } from './utils/ranking';

const db = admin.firestore();

export const searchUsers = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const query = req.query.q as string;

    if (!query || query.trim() === '') {
      res.status(400).json({ error: "query parameter 'q' is required" });
      return;
    }

    // Prefix search: username >= query AND username < query + '\uf8ff'
    const searchQuery = query.trim().toLowerCase();
    const upperBound = searchQuery.slice(0, -1) + String.fromCharCode(searchQuery.charCodeAt(searchQuery.length - 1) + 1);

    const snapshot = await db.collection('users')
      .where('username', '>=', searchQuery)
      .where('username', '<', upperBound)
      .limit(100)
      .get();

    if (snapshot.empty) {
      res.json({ data: [] });
      return;
    }

    // Get users with their ratings
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username as string,
      rating: doc.data().rating as number,
    }));

    // Calculate ranks for all users
    const rankMap = await calculateRanksForUsers(users);

    // Format response
    const results = users.map(user => ({
      global_rank: rankMap.get(user.id) || 0,
      username: user.username,
      rating: user.rating,
    }));

    // Sort by rank (ascending)
    results.sort((a, b) => a.global_rank - b.global_rank);

    res.json({ data: results });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
