#!/bin/sh

# Setup
bash ./@scripts/setup.sh

echo "Starting services..."
docker compose up -d --build > /dev/null 2>&1

echo "Services up and running!"