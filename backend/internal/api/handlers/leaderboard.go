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

	// Get leaderboard entries from Redis
	entries, err := h.rankService.GetLeaderboard(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get user details from PostgreSQL
	userIDs := make([]int64, len(entries))
	entryMap := make(map[int64]*ranking.LeaderboardEntry)
	for i, entry := range entries {
		userIDs[i] = entry.UserID
		entryMap[entry.UserID] = &entries[i]
	}

	// Fetch usernames for all entries
	users, err := h.userRepo.GetAll(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Combine data
	response := make([]models.LeaderboardEntry, 0, len(entries))
	for _, user := range users {
		if entry, exists := entryMap[user.ID]; exists {
			response = append(response, models.LeaderboardEntry{
				Rank:     entry.Rank,
				Username: user.Username,
				Rating:   user.Rating,
				UserID:   user.ID,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data": response,
		"page": page,
		"limit": limit,
	})
}
