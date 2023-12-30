#!/bin/sh

# Start shared services with Docker Compose
echo "Starting shared services..."
docker compose up -d  shared-services > /dev/null 2>&1

sleep 2

# Start Notification related services
echo "Starting notification related services..."
docker compose up mailhog notification-service -d  --build > /dev/null 2>&1

echo "Services running!"

echo "Running services: "
docker ps --format '{{.Names}}'