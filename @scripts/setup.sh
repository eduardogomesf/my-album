#!/bin/sh

# Wait for Kong to be fully operational
echo "Setting up services with configurations..."
bash ./@scripts/configure-kong.sh

echo "Setup completed!"