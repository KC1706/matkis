.PHONY: help run seed migrate test clean

help:
	@echo "Available commands:"
	@echo "  make run      - Run the backend server"
	@echo "  make seed     - Seed the database with 10,000 users"
	@echo "  make migrate  - Run database migrations"
	@echo "  make test     - Run tests"
	@echo "  make clean    - Clean build artifacts"

run:
	@echo "Starting backend server..."
	@go run cmd/server/main.go

seed:
	@echo "Seeding database..."
	@go run cmd/seed/main.go

migrate:
	@echo "Running database migrations..."
	@psql -h $(DB_HOST) -p $(DB_PORT) -U $(DB_USER) -d $(DB_NAME) -f migrations/schema.sql

test:
	@echo "Running tests..."
	@go test ./...

clean:
	@echo "Cleaning build artifacts..."
	@go clean
