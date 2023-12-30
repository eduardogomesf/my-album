#!/bin/sh

# Wait for Kong to be fully operational
echo "Setting up services with configurations..."

echo "Configuring Kong..."
bash ./@scripts/configure-kong.sh

sleep 5

echo "Services setup completed! Stop services..."
docker compose down > /dev/null 2>&1

echo "Services stopped"

echo "Go to the next step: start-services.sh"