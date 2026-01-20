package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"matkis-assignment/backend/internal/config"
	"matkis-assignment/backend/internal/database"
	"matkis-assignment/backend/internal/models"
	"matkis-assignment/backend/internal/ranking"
	"matkis-assignment/backend/internal/repository"
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

	ctx := context.Background()
	rand.Seed(time.Now().UnixNano())

	// Generate usernames
	firstNames := []string{
		"rahul", "brandon", "cody", "lee", "leslie", "wade", "soham", "brandie",
		"jorge", "kristin", "alex", "sam", "taylor", "jordan", "casey", "riley",
		"avery", "quinn", "dakota", "skyler", "morgan", "cameron", "hayden",
		"logan", "blake", "sage", "river", "phoenix", "rowan", "finley",
	}
	lastNames := []string{
		"burman", "mathur", "kumar", "singh", "patel", "sharma", "gupta", "verma",
		"reddy", "rao", "mehta", "jain", "agarwal", "malik", "kapoor", "chopra",
		"nair", "iyer", "menon", "nair", "krishnan", "raman", "sundaram",
	}

	// Generate 10,000+ users
	numUsers := 10000
	log.Printf("Generating %d users...", numUsers)

	// Batch insert for efficiency
	batchSize := 1000
	usersCreated := 0

	for i := 0; i < numUsers; i += batchSize {
		currentBatch := batchSize
		if i+batchSize > numUsers {
			currentBatch = numUsers - i
		}

		// Generate batch of users
		users := make([]*models.User, 0, currentBatch)
		usernames := make(map[string]bool)

		for j := 0; j < currentBatch; j++ {
			var username string
			attempts := 0
			for {
				// Generate unique username
				firstName := firstNames[rand.Intn(len(firstNames))]
				if rand.Float32() < 0.3 {
					// 30% chance of compound username
					lastName := lastNames[rand.Intn(len(lastNames))]
					username = fmt.Sprintf("%s_%s", firstName, lastName)
				} else if rand.Float32() < 0.5 {
					// 20% chance of username with number
					username = fmt.Sprintf("%s%d", firstName, rand.Intn(1000))
				} else {
					// 50% chance of simple username
					username = firstName
				}

				// Ensure uniqueness
				if !usernames[username] {
					usernames[username] = true
					break
				}
				attempts++
				if attempts > 100 {
					username = fmt.Sprintf("%s_%d_%d", firstName, i+j, time.Now().UnixNano())
					break
				}
			}

			// Random rating between 100 and 5000
			rating := 100 + rand.Intn(4901)

			users = append(users, &models.User{
				Username: username,
				Rating:   rating,
			})
		}

		// Insert batch into PostgreSQL and Redis
		for _, user := range users {
			if err := userRepo.Create(ctx, user); err != nil {
				log.Printf("Warning: Failed to create user %s: %v", user.Username, err)
				continue
			}

			// Update Redis leaderboard
			if err := rankService.UpdateUserRating(ctx, user.ID, user.Rating); err != nil {
				log.Printf("Warning: Failed to update leaderboard for user %s: %v", user.Username, err)
				continue
			}

			usersCreated++
		}

		if (i+currentBatch)%1000 == 0 {
			log.Printf("Created %d users...", usersCreated)
		}
	}

	log.Printf("Successfully created %d users", usersCreated)
	log.Println("Seeding completed!")
}
