package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"matkis-assignment/backend/internal/models"
	"matkis-assignment/backend/internal/ranking"
	"matkis-assignment/backend/internal/repository"
)

type UserHandler struct {
	userRepo    *repository.UserRepository
	rankService *ranking.RankingService
}

func NewUserHandler(userRepo *repository.UserRepository, rankService *ranking.RankingService) *UserHandler {
	return &UserHandler{
		userRepo:    userRepo,
		rankService: rankService,
	}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Rating   int    `json:"rating" binding:"required,min=100,max=5000"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := &models.User{
		Username: req.Username,
		Rating:   req.Rating,
	}

	if err := h.userRepo.Create(c.Request.Context(), user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update Redis leaderboard
	if err := h.rankService.UpdateUserRating(c.Request.Context(), user.ID, user.Rating); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update leaderboard: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) UpdateRating(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var req struct {
		Rating int `json:"rating" binding:"required,min=100,max=5000"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update in PostgreSQL
	if err := h.userRepo.UpdateRating(c.Request.Context(), id, req.Rating); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update in Redis
	if err := h.rankService.UpdateUserRating(c.Request.Context(), id, req.Rating); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update leaderboard: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "rating updated successfully"})
}
