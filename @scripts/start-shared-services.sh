#!/bin/sh

# Start all shared services with Docker Compose
echo "Starting shared services..."

docker-compose up zookeeper kafka kong-database kong-migration kong konga -d

echo "Shared services started"

sleep 2