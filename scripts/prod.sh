#!/bin/bash

# Development startup script for the DevOps API

echo "Starting DevOps API server..."
echo "==============================="

# Check if environment file exists
if [ ! -f .env.production ]; then
  echo "Error: .env.production file not found!"
  echo "Please create the .env.production file with the necessary environment variables."
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running!"
  echo "Please start Docker Desktop and try again."
  exit 1
fi

echo "Building and starting production containers..."
echo " - Application will connect to remote Neon database"
echo " - Application will run with hot reload enabled"
echo ""

# Stop any existing container
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Start containers in detached mode
docker compose -f docker-compose.prod.yml up -d --build

# Wait for application to start
echo "Waiting for application to be ready..."
sleep 5

# Run migrations
echo "Applying latest schema with Drizzle..."
npm run db:migrate

echo ""
echo "Production environment started!"
echo "Application: http://localhost:3000"
echo "logs: docker logs devops-api-prod"
echo ""
echo "Useful commands:"
echo "  View logs: docker logs -f devops-api-prod"
echo "  Stop app: docker compose -f docker-compose.prod.yml down"

# Show logs
docker compose -f docker-compose.prod.yml logs -f