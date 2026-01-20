package search

import (
	"context"

	"matkis-assignment/backend/internal/models"
	"matkis-assignment/backend/internal/ranking"
	"matkis-assignment/backend/internal/repository"
)

type SearchService struct {
	userRepo  *repository.UserRepository
	rankService *ranking.RankingService
}

func NewSearchService(userRepo *repository.UserRepository, rankService *ranking.RankingService) *SearchService {
	return &SearchService{
		userRepo:    userRepo,
		rankService: rankService,
	}
}

// SearchUsers performs prefix search and returns users with their global ranks
func (s *SearchService) SearchUsers(ctx context.Context, prefix string, limit int) ([]*models.UserWithRank, error) {
	// Search users by prefix in PostgreSQL
	users, err := s.userRepo.SearchByPrefix(ctx, prefix, limit)
	if err != nil {
		return nil, err
	}

	if len(users) == 0 {
		return []*models.UserWithRank{}, nil
	}

	// Get user IDs for rank lookup
	userIDs := make([]int64, len(users))
	for i, user := range users {
		userIDs[i] = user.ID
	}

	// Get ranks for all users in batch
	ranks, err := s.rankService.GetRanksForUsers(ctx, userIDs)
	if err != nil {
		return nil, err
	}

	// Combine user data with ranks
	result := make([]*models.UserWithRank, len(users))
	for i, user := range users {
		rank, exists := ranks[user.ID]
		if !exists {
			rank = 0 // User not in leaderboard
		}

		result[i] = &models.UserWithRank{
			User:      *user,
			GlobalRank: rank,
		}
	}

	return result, nil
}
