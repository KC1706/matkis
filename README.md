# Matkis Leaderboard System

A scalable leaderboard system with search functionality, built with **Golang** (PostgreSQL + Redis) and React Native (Expo), deployed to Railway.

## Features

- **Scalable Leaderboard**: Handles 10,000+ users with capacity for millions
- **Tie-Aware Ranking**: Users with the same rating share the same rank
- **Fast Search**: Prefix-based user search with instant results
- **Live Updates**: Polling mechanism for real-time leaderboard updates
- **Cross-Platform**: React Native app works on iOS, Android, and Web

## Architecture

### Backend (Golang)
- **Gin Framework**: HTTP web framework
- **PostgreSQL**: Relational database for user data
- **Redis**: Sorted sets for efficient leaderboard queries and tie-aware ranking
- **RESTful API**: Clean API design with proper error handling

### Frontend (React Native/Expo)
- **Leaderboard Screen**: Paginated list with polling
- **Search Screen**: Debounced prefix search
- **Optimized Performance**: Virtualized lists, efficient queries

## Quick Start

### Prerequisites
- Go 1.21+
- PostgreSQL 12+
- Redis 6+
- Node.js 18+ (for frontend)
- Expo CLI (optional)

### Backend Setup

1. **Install Dependencies:**
```bash
cd backend
go mod download
```

2. **Set Up Databases:**

   **Option A: Using Docker Compose (Recommended)**
   ```bash
   cd backend
   docker-compose up -d
   ```

   **Option B: Local PostgreSQL and Redis**
   - Ensure PostgreSQL and Redis are running locally
   - Create database: `createdb leaderboard`

3. **Configure Environment:**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

4. **Run Migrations:**
```bash
make migrate
# Or manually:
psql -h localhost -U postgres -d leaderboard -f migrations/schema.sql
```

5. **Seed Data:**
```bash
make seed
```

6. **Start Server:**
```bash
make run
# Server runs on http://localhost:8080
```

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend
npm install
```

2. **Configure API URL:**
   - For local development: Already configured to `http://localhost:8080`
   - For production: Set `EXPO_PUBLIC_API_URL` environment variable

3. **Run Locally:**
```bash
npm start
# Press 'w' for web, 'i' for iOS, 'a' for Android
```

4. **Build for Web:**
```bash
npm run build:web
```

## API Endpoints

### Get Leaderboard
```
GET /api/leaderboard?page=1&limit=50
```

**Response:**
```json
{
  "data": [
    {
      "rank": 1,
      "username": "brandon",
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

**Response:**
```json
{
  "data": [
    {
      "global_rank": 200,
      "username": "rahul",
      "rating": 4600
    },
    {
      "global_rank": 800,
      "username": "rahul_burman",
      "rating": 3900
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

## Project Structure

```
matkis_assignment/
├── backend/                 # Golang backend
│   ├── cmd/
│   │   ├── server/         # Main server
│   │   └── seed/           # Database seeding
│   ├── internal/
│   │   ├── api/            # HTTP handlers
│   │   ├── config/         # Configuration
│   │   ├── database/       # DB connections
│   │   ├── models/         # Data models
│   │   ├── ranking/        # Ranking service
│   │   ├── repository/     # Database layer
│   │   └── search/         # Search service
│   ├── migrations/         # Database schema
│   ├── docker-compose.yml  # Local dev setup
│   └── Makefile           # Dev commands
├── frontend/               # React Native Expo app
│   ├── app/
│   ├── components/
│   ├── services/
│   └── hooks/
└── netlify/                 # Archived (old Node.js implementation)
```

## Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.

## Deployment

### Backend (Railway)

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed Railway deployment instructions.

Quick steps:
1. Create Railway project
2. Add PostgreSQL and Redis services
3. Deploy Golang backend
4. Configure environment variables
5. Run migrations
6. Seed data (optional)

### Frontend (Netlify/Vercel)

1. Build web version:
```bash
cd frontend
npm run build:web
```

2. Deploy to Netlify:
```bash
netlify deploy --prod
```

3. Set environment variable:
   - `EXPO_PUBLIC_API_URL`: Your Railway backend URL

## Performance

- **Leaderboard Load**: < 1 second for 10k+ users (Redis sorted sets)
- **Search Response**: < 200ms (PostgreSQL indexed queries)
- **Polling Interval**: 3 seconds
- **Debounce Delay**: 300ms

## Migration Notes

This project was migrated from Node.js/TypeScript (Netlify Functions + Firebase) to Golang (PostgreSQL + Redis) to meet assignment requirements.

See [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) for details.

## License

MIT
