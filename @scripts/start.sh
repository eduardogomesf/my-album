#!/bin/sh

# Start all services services with Docker Compose
echo "Starting services..."
docker compose up -d --build > /dev/null 2>&1

echo "Services up and running!"

docker ps --format '{{.Names}}'