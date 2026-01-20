package ranking

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v8"
)

const LeaderboardKey = "leaderboard:global"

type RankingService struct {
	redis *redis.Client
}

func NewRankingService(redis *redis.Client) *RankingService {
	return &RankingService{redis: redis}
}

// UpdateUserRating updates a user's rating in the Redis sorted set
func (s *RankingService) UpdateUserRating(ctx context.Context, userID int64, rating int) error {
	return s.redis.ZAdd(ctx, LeaderboardKey, &redis.Z{
		Score:  float64(rating),
		Member: userID,
	}).Err()
}

// GetRank calculates the tie-aware rank for a user
// Rank = number of users with rating > user's rating + 1
func (s *RankingService) GetRank(ctx context.Context, userID int64) (int, error) {
	// Get user's rating
	score, err := s.redis.ZScore(ctx, LeaderboardKey, fmt.Sprintf("%d", userID)).Result()
	if err != nil {
		if err == redis.Nil {
			return 0, fmt.Errorf("user not found in leaderboard")
		}
		return 0, fmt.Errorf("failed to get user score: %w", err)
	}

	// Count users with rating > user's rating
	// Using ZCount with (score, +inf) to count higher ratings
	higherCount, err := s.redis.ZCount(ctx, LeaderboardKey,
		fmt.Sprintf("(%f", score), "+inf").Result()
	if err != nil {
		return 0, fmt.Errorf("failed to count higher ratings: %w", err)
	}

	// Rank = higherCount + 1
	return int(higherCount) + 1, nil
}

// GetRanksForUsers gets ranks for multiple users efficiently
func (s *RankingService) GetRanksForUsers(ctx context.Context, userIDs []int64) (map[int64]int, error) {
	ranks := make(map[int64]int)
	
	// Use pipeline for batch operations
	pipe := s.redis.Pipeline()
	cmds := make(map[int64]*redis.FloatCmd)
	
	for _, userID := range userIDs {
		cmds[userID] = pipe.ZScore(ctx, LeaderboardKey, fmt.Sprintf("%d", userID))
	}
	
	_, err := pipe.Exec(ctx)
	if err != nil && err != redis.Nil {
		return nil, fmt.Errorf("failed to execute pipeline: %w", err)
	}
	
	// Get all unique ratings
	ratingMap := make(map[float64][]int64)
	for userID, cmd := range cmds {
		score, err := cmd.Result()
		if err != nil {
			if err == redis.Nil {
				continue
			}
			return nil, fmt.Errorf("failed to get score for user %d: %w", userID, err)
		}
		ratingMap[score] = append(ratingMap[score], userID)
	}
	
	// For each unique rating, calculate rank once
	for rating, ids := range ratingMap {
		higherCount, err := s.redis.ZCount(ctx, LeaderboardKey,
			fmt.Sprintf("(%f", rating), "+inf").Result()
		if err != nil {
			return nil, fmt.Errorf("failed to count higher ratings: %w", err)
		}
		
		rank := int(higherCount) + 1
		for _, userID := range ids {
			ranks[userID] = rank
		}
	}
	
	return ranks, nil
}

// GetLeaderboard gets top N users with their ranks
func (s *RankingService) GetLeaderboard(ctx context.Context, limit, offset int) ([]LeaderboardEntry, error) {
	// Get users from Redis sorted set (descending order)
	results, err := s.redis.ZRevRangeWithScores(ctx, LeaderboardKey, int64(offset), int64(offset+limit-1)).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get leaderboard: %w", err)
	}

	if len(results) == 0 {
		return []LeaderboardEntry{}, nil
	}

	// Calculate ranks with tie-awareness
	entries := make([]LeaderboardEntry, 0, len(results))
	currentRank := offset + 1
	prevRating := float64(-1)
	rankOffset := 0

	for i, result := range results {
		rating := result.Score
		
		// If rating changed, update rank
		if rating != prevRating {
			currentRank = offset + i + 1 - rankOffset
			prevRating = rating
		}

		var userID int64
		if err := fmt.Sscanf(fmt.Sprintf("%v", result.Member), "%d", &userID); err != nil {
			continue
		}

		entries = append(entries, LeaderboardEntry{
			UserID: userID,
			Rating: int(rating),
			Rank:   currentRank,
		})
	}

	return entries, nil
}

type LeaderboardEntry struct {
	UserID int64
	Rating int
	Rank   int
}
