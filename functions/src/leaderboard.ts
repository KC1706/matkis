import * as functions from 'firebase-functions';
import { getLeaderboardEntries } from './utils/ranking';

export const getLeaderboard = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (page < 1) {
      res.status(400).json({ error: 'Page must be >= 1' });
      return;
    }

    if (limit < 1 || limit > 100) {
      res.status(400).json({ error: 'Limit must be between 1 and 100' });
      return;
    }

    const offset = (page - 1) * limit;
    const entries = await getLeaderboardEntries(limit, offset);

    res.json({
      data: entries,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
