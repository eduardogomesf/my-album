#!/bin/sh

# Variables
KONG_ADMIN_URL=http://localhost:8001

echo "Starting Kong configuration..."

docker compose up kong-database kong-migration kong -d > /dev/null 2>&1

echo "Waiting for Kong to be fully operational..."
sleep 10

echo "Applying Kong configurations..."
# Create the 'user-service' service
curl -s -X POST $KONG_ADMIN_URL/services \
    -d name=user-service \
    -d host=user-service \
    -d port=3000 \
    -d protocol=http \
    -d retries=5 \
    -d connect_timeout=30000 \
    -d write_timeout=60000 \
    -d read_timeout=60000 \
    -d tags[]=microservice \
    -d tags[]=user-management > /dev/null 2>&1
    

# Create the 'user-login' route for the 'user-service'
curl -s -X POST $KONG_ADMIN_URL/services/user-service/routes \
    -d name=user-login \
    -d paths[]=/users/login \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d preserve_host=false \
    -d tags[]=user-service > /dev/null 2>&1

# Create the 'create-new-user' route for the 'user-service'
curl -s -X POST $KONG_ADMIN_URL/services/user-service/routes \
    -d name=create-new-user \
    -d paths[]=/users \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d preserve_host=false \
    -d tags[]=user-service > /dev/null 2>&1

sleep 2

docker stop kong-database kong-migration kong 

echo "Kong configuration completed."
