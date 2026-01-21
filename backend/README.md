# Leaderboard Backend (Golang)

A scalable leaderboard system built with Golang, PostgreSQL, and Redis.

## Features

- Tie-aware ranking system
- Efficient leaderboard queries using Redis sorted sets
- Fast user search with prefix matching
- Handles 10,000+ users efficiently
- RESTful API with Gin framework

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher
- Redis 6 or higher

## Local Development Setup

### Option 1: Using Docker Compose (Recommended)

1. Start PostgreSQL and Redis:
```bash
docker-compose up -d
```

2. Run database migrations:
```bash
make migrate
# Or manually:
psql -h localhost -U postgres -d leaderboard -f migrations/schema.sql
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Start the server:
```bash
make run
```

5. Seed the database (optional):
```bash
make seed
```

### Option 2: Using Local PostgreSQL and Redis

1. Ensure PostgreSQL and Redis are running locally

2. Create the database:
```bash
createdb leaderboard
```

3. Run migrations:
```bash
psql -h localhost -U postgres -d leaderboard -f migrations/schema.sql
```

4. Copy and configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Start the server:
```bash
make run
```

6. Seed the database:
```bash
make seed
```

## API Endpoints

### Get Leaderboard
```
GET /api/leaderboard?page=1&limit=50
```

Response:
```json
{
  "data": [
    {
      "rank": 1,
      "username": "user1",
      "rating": 5000,
      "user_id": 1
    }
  ],
  "page": 1,
  "limit": 50
}
```

### Search Users
```
GET /api/search?q=rahul
```

Response:
```json
{
  "data": [
    {
      "global_rank": 200,
      "username": "rahul",
      "rating": 4600
    }
  ]
}
```

### Create User
```
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "rating": 2500
}
```

### Update User Rating
```
POST /api/users/:id/update-rating
Content-Type: application/json

{
  "rating": 3000
}
```

## Environment Variables

- `PORT` - Server port (default: 8080)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USER` - PostgreSQL user
- `DB_PASSWORD` - PostgreSQL password
- `DB_NAME` - Database name
- `REDIS_ADDR` - Redis address
- `REDIS_PASSWORD` - Redis password (optional)
- `REDIS_DB` - Redis database number (default: 0)

## Architecture

- **PostgreSQL**: Stores user data (username, rating, timestamps)
- **Redis**: Sorted set for efficient leaderboard queries and ranking
- **Gin**: HTTP web framework
- **Tie-aware ranking**: Users with the same rating get the same rank

## Testing

Run tests:
```bash
make test
```

## Deployment

See deployment documentation for Railway, Render, or other platforms.
