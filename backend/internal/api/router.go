package api

import (
	"github.com/gin-gonic/gin"
	"matkis-assignment/backend/internal/api/handlers"
	"matkis-assignment/backend/internal/ranking"
	"matkis-assignment/backend/internal/repository"
	"matkis-assignment/backend/internal/search"
)

func SetupRouter(userRepo *repository.UserRepository, rankService *ranking.RankingService, searchService *search.SearchService) *gin.Engine {
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := router.Group("/api")
	{
		leaderboardHandler := handlers.NewLeaderboardHandler(userRepo, rankService)
		searchHandler := handlers.NewSearchHandler(searchService)
		userHandler := handlers.NewUserHandler(userRepo, rankService)

		api.GET("/leaderboard", leaderboardHandler.GetLeaderboard)
		api.GET("/search", searchHandler.SearchUsers)
		api.POST("/users", userHandler.CreateUser)
		api.POST("/users/:id/update-rating", userHandler.UpdateRating)
	}

	return router
}
