# Migration Notes: Node.js to Golang

This document tracks the migration from Node.js/TypeScript (Netlify Functions + Firebase) to Golang (PostgreSQL + Redis).

## What Changed

### Backend
- **Before**: Node.js/TypeScript with Netlify Functions and Firebase Firestore
- **After**: Golang with Gin framework, PostgreSQL, and Redis

### API Endpoints
- **Before**: `/.netlify/functions/getLeaderboard`, `/.netlify/functions/searchUsers`
- **After**: `/api/leaderboard`, `/api/search`

### Database
- **Before**: Firebase Firestore
- **After**: PostgreSQL (user data) + Redis (leaderboard rankings)

### Frontend Changes
- Updated API endpoints in `frontend/services/api.ts`
- Updated API base URL in `frontend/config/constants.ts`
- Updated types to match Golang API responses

## Archived Code

The following directories contain the old Node.js implementation (kept for reference):
- `netlify/functions/` - Netlify Functions implementation
- `netlify/package.json` - Netlify Functions dependencies

## New Backend Structure

```
backend/
├── cmd/
│   ├── server/        # Main server application
│   └── seed/          # Database seeding script
├── internal/
│   ├── api/           # HTTP handlers and routing
│   ├── config/        # Configuration management
│   ├── database/      # Database connections (PostgreSQL, Redis)
│   ├── models/        # Data models
│   ├── ranking/       # Ranking service (Redis)
│   ├── repository/    # Database repository layer
│   └── search/        # Search service
├── migrations/         # Database schema
├── docker-compose.yml # Local development setup
├── Makefile          # Development commands
└── README.md         # Backend documentation
```

## Migration Benefits

1. **Performance**: Redis sorted sets provide O(log N) leaderboard queries
2. **Scalability**: PostgreSQL + Redis can handle millions of users
3. **Compliance**: Meets assignment requirement for Golang backend
4. **Maintainability**: Type-safe Go code with clear separation of concerns

## Testing the Migration

1. Start local databases (PostgreSQL + Redis)
2. Run migrations: `make migrate`
3. Seed data: `make seed`
4. Start backend: `make run`
5. Update frontend API URL to `http://localhost:8080`
6. Test leaderboard and search functionality

## Deployment

See `RAILWAY_DEPLOYMENT.md` for Railway deployment instructions.
