# Railway Deployment Guide

This guide explains how to deploy the Golang backend to Railway.app.

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. Railway CLI installed (optional, can use web interface)
3. Git repository pushed to GitHub/GitLab

## Step 1: Create Railway Project

1. Go to https://railway.app and create a new project
2. Select "Deploy from GitHub repo" or "Empty Project"

## Step 2: Add PostgreSQL Service

1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Railway will automatically create a PostgreSQL instance
3. Note the connection details (will be available as environment variables)

## Step 3: Add Redis Service

1. Click "+ New" → "Database" → "Add Redis"
2. Railway will automatically create a Redis instance
3. Note the connection details

## Step 4: Deploy Golang Backend

1. Click "+ New" → "GitHub Repo" (or "Empty Service")
2. Select your repository
3. Railway will auto-detect it's a Go project
4. Set the root directory to `backend/` if deploying from monorepo

## Step 5: Configure Environment Variables

In your Golang service, add these environment variables:

```
PORT=8080
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
REDIS_ADDR=${{Redis.REDIS_URL}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
REDIS_DB=0
```

Railway automatically provides these variables when you link services:
- `${{Postgres.*}}` - PostgreSQL connection variables
- `${{Redis.*}}` - Redis connection variables

## Step 6: Configure Build Settings

Railway should auto-detect Go, but verify:

- **Root Directory**: `backend` (if deploying from monorepo)
- **Build Command**: `go build -o server cmd/server/main.go`
- **Start Command**: `./server`

Or use the `railway.toml` file in the backend directory.

## Step 7: Run Database Migrations

After deployment, run migrations:

1. Connect to your PostgreSQL service
2. Run the migration:
```sql
-- Copy contents of backend/migrations/schema.sql
```

Or use Railway's PostgreSQL console:
1. Go to PostgreSQL service
2. Click "Query" tab
3. Paste and run `schema.sql` contents

## Step 8: Seed Initial Data (Optional)

You can seed data using Railway's CLI or by creating a one-time job:

```bash
railway run --service backend go run cmd/seed/main.go
```

## Step 9: Get Public URL

1. Go to your Golang service
2. Click "Settings" → "Generate Domain"
3. Copy the public URL (e.g., `https://your-app.railway.app`)

## Step 10: Update Frontend Configuration

Update your frontend to use the Railway backend URL:

```bash
# In frontend/.env or expo config
EXPO_PUBLIC_API_URL=https://your-app.railway.app
```

## Troubleshooting

### Build Fails
- Check that `go.mod` is in the backend directory
- Verify Go version (Railway uses latest stable)
- Check build logs in Railway dashboard

### Database Connection Fails
- Verify environment variables are set correctly
- Check that PostgreSQL service is running
- Ensure services are linked in Railway

### Redis Connection Fails
- Verify Redis URL format
- Check Redis service is running
- Ensure Redis password is set if required

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DB_HOST` | PostgreSQL host | `containers-us-west-xxx.railway.app` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | (auto-generated) |
| `DB_NAME` | Database name | `railway` |
| `REDIS_ADDR` | Redis address | `containers-us-west-xxx.railway.app:6379` |
| `REDIS_PASSWORD` | Redis password | (if required) |
| `REDIS_DB` | Redis database number | `0` |

## Monitoring

- Check logs in Railway dashboard
- Monitor service health
- Set up alerts for service failures

## Scaling

Railway automatically scales based on traffic. For high-traffic scenarios:
- Consider connection pooling settings
- Monitor database and Redis connections
- Use Railway's metrics to identify bottlenecks
