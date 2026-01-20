# Leaderboard Backend

Golang backend for the scalable leaderboard system.

## Prerequisites

- Go 1.21+
- PostgreSQL 12+
- Redis 6+

## Setup

1. Install dependencies:
```bash
go mod download
```

2. Create a `.env` file:
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=leaderboard
REDIS_ADDR=localhost:6379
REDIS_PASSWORD=
REDIS_DB=0
```

3. Create the database:
```bash
createdb leaderboard
```

4. Run migrations:
```bash
psql -d leaderboard -f migrations/schema.sql
```

5. Seed the database:
```bash
go run cmd/seed/main.go
```

6. Start the server:
```bash
go run cmd/server/main.go
```

## API Endpoints

- `GET /api/leaderboard?page=1&limit=50` - Get paginated leaderboard
- `GET /api/search?q=username` - Search users by prefix
- `POST /api/users` - Create a new user
- `POST /api/users/:id/update-rating` - Update user rating

## Architecture

- **PostgreSQL**: Persistent storage for user data
- **Redis**: Sorted sets for efficient leaderboard queries
- **Tie-aware ranking**: Users with same rating share the same rank
