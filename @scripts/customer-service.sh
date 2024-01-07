#!/bin/sh

# Start shared services with Docker Compose
echo "Starting shared services..."
docker compose up -d  shared-services > /dev/null 2>&1

sleep 2

# Start User related services
echo "Starting user related services..."
docker compose up user-service-mongodb user-service -d  --build > /dev/null 2>&1

echo "Services running!"

echo "Running services: "
docker ps --format '{{.Names}}'