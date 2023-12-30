#!/bin/sh

# Start all shared services with Docker Compose
echo "Starting shared services..."

docker-compose up zookeeper kafka -d

echo "Shared services started"

sleep 2