import * as admin from 'firebase-admin';

const db = admin.firestore();

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  rating: number;
  rank: number;
}

/**
 * Calculate tie-aware rank for a user
 * Rank = number of users with rating > user's rating + 1
 */
export async function calculateRank(rating: number): Promise<number> {
  const higherCount = await db.collection('users')
    .where('rating', '>', rating)
    .count()
    .get();

  return higherCount.data().count + 1;
}

/**
 * Calculate ranks for multiple users efficiently
 * Groups users by rating to minimize queries
 */
export async function calculateRanksForUsers(
  users: Array<{ id: string; rating: number }>
): Promise<Map<string, number>> {
  const rankMap = new Map<string, number>();
  
  // Group users by rating
  const ratingGroups = new Map<number, string[]>();
  for (const user of users) {
    if (!ratingGroups.has(user.rating)) {
      ratingGroups.set(user.rating, []);
    }
    ratingGroups.get(user.rating)!.push(user.id);
  }

  // Calculate rank for each unique rating
  for (const [rating, userIds] of ratingGroups) {
    const rank = await calculateRank(rating);
    for (const userId of userIds) {
      rankMap.set(userId, rank);
    }
  }

  return rankMap;
}

/**
 * Get leaderboard entries with tie-aware ranking
 */
export async function getLeaderboardEntries(
  limit: number,
  offset: number
): Promise<LeaderboardEntry[]> {
  // Query users ordered by rating DESC, username ASC
  const snapshot = await db.collection('users')
    .orderBy('rating', 'desc')
    .orderBy('username', 'asc')
    .limit(limit)
    .offset(offset)
    .get();

  if (snapshot.empty) {
    return [];
  }

  const entries: LeaderboardEntry[] = [];
  let currentRank = offset + 1;
  let prevRating = -1;
  let rankOffset = 0;

  snapshot.forEach((doc, index) => {
    const data = doc.data();
    const rating = data.rating as number;

    // If rating changed, update rank
    if (rating !== prevRating) {
      currentRank = offset + index + 1 - rankOffset;
      prevRating = rating;
      rankOffset = 0;
    } else {
      rankOffset++;
    }

    entries.push({
      user_id: doc.id,
      username: data.username as string,
      rating: rating,
      rank: currentRank,
    });
  });

  return entries;
}
