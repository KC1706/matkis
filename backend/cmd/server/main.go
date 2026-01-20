package main

import (
	"log"

	"matkis-assignment/backend/internal/api"
	"matkis-assignment/backend/internal/config"
	"matkis-assignment/backend/internal/database"
	"matkis-assignment/backend/internal/ranking"
	"matkis-assignment/backend/internal/repository"
	"matkis-assignment/backend/internal/search"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize PostgreSQL
	db, err := database.NewPostgresDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	// Initialize Redis
	redisClient, err := database.NewRedisClient(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer redisClient.Close()

	// Initialize services
	userRepo := repository.NewUserRepository(db)
	rankService := ranking.NewRankingService(redisClient)
	searchService := search.NewSearchService(userRepo, rankService)

	// Setup router
	router := api.SetupRouter(userRepo, rankService, searchService)

	log.Printf("Server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
