#!/bin/sh

# Start all services with Docker Compose
docker-compose up -d

# Wait for Kong to be fully operational
echo "Waiting for Kong to start..."
sleep 30  # Adjust the sleep duration as necessary

# Now run the Kong configuration script
echo "Configuring Kong..."
bash ./scripts/configure-kong.sh

echo "Services started and configured."
