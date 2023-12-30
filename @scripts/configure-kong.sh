#!/bin/sh

# Variables
KONG_ADMIN_URL=http://localhost:8001

# Start kong related services
echo "Starting kong related services..."
docker compose up kong-database kong-migration kong konga -d > /dev/null 2>&1

echo "Waiting for Kong to be fully operational..."
sleep 10

echo "Configuring Kong..."
# Create the 'customer-service' service
curl -s -X POST $KONG_ADMIN_URL/services \
    -d name=customer-service \
    -d host=customer-service \
    -d port=3000 \
    -d protocol=http \
    -d retries=5 \
    -d connect_timeout=30000 \
    -d write_timeout=60000 \
    -d read_timeout=60000 \
    -d tags[]=microservice \
    -d tags[]=user-management

# Create the 'customer-login' route for the 'customer-service'
curl -s -X POST $KONG_ADMIN_URL/services/customer-service/routes \
    -d name=customer-login \
    -d paths[]=/customers/login \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d preserve_host=false \
    -d tags[]=customer-service

# Create the 'create-new-customer' route for the 'customer-service'
curl -s -X POST $KONG_ADMIN_URL/services/customer-service/routes \
    -d name=create-new-customer \
    -d paths[]=/customers \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d preserve_host=false \
    -d tags[]=customer-service

# echo "Stop kong related services..."
# docker stop kong-database kong-migration kong konga 

echo "Kong configuration completed."
