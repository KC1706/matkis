package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"matkis-assignment/backend/internal/models"
	"matkis-assignment/backend/internal/ranking"
	"matkis-assignment/backend/internal/repository"
)

type LeaderboardHandler struct {
	userRepo    *repository.UserRepository
	rankService *ranking.RankingService
}

func NewLeaderboardHandler(userRepo *repository.UserRepository, rankService *ranking.RankingService) *LeaderboardHandler {
	return &LeaderboardHandler{
		userRepo:    userRepo,
		rankService: rankService,
	}
}

func (h *LeaderboardHandler) GetLeaderboard(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 50
	}

	offset := (page - 1) * limit

	// Get leaderboard entries from Redis (sorted by rating)
	entries, err := h.rankService.GetLeaderboard(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(entries) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"data": []models.LeaderboardEntry{},
			"page": page,
			"limit": limit,
		})
		return
	}

	// Get user IDs from Redis entries
	userIDs := make([]int64, len(entries))
	for i, entry := range entries {
		userIDs[i] = entry.UserID
	}

	// Fetch user details from PostgreSQL by IDs
	users, err := h.userRepo.GetByIDs(c.Request.Context(), userIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create map of user ID to user data
	userMap := make(map[int64]*models.User)
	for i := range users {
		userMap[users[i].ID] = users[i]
	}

	// Combine Redis ranking data with PostgreSQL user data
	response := make([]models.LeaderboardEntry, 0, len(entries))
	for _, entry := range entries {
		user, exists := userMap[entry.UserID]
		if !exists {
			// Skip if user not found in PostgreSQL (shouldn't happen, but handle gracefully)
			continue
		}
		response = append(response, models.LeaderboardEntry{
			Rank:     entry.Rank,
			Username: user.Username,
			Rating:   entry.Rating, // Use rating from Redis (source of truth for ranking)
			UserID:   user.ID,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"data": response,
		"page": page,
		"limit": limit,
	})
}
