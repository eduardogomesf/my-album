#!/bin/sh

# Start shared services with Docker Compose
echo "Starting shared services..."
docker compose up -d  shared-services > /dev/null 2>&1

sleep 2

# Start Customer related services
echo "Starting customer related services..."
docker compose up customer-service-mongodb customer-service -d  --build > /dev/null 2>&1

echo "Services running!"

echo "Running services: "
docker ps --format '{{.Names}}'