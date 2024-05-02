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
    -d paths[]=/login \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
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
    -d tags[]=user-service > /dev/null 2>&1

# Create the 'refresh-token' route for the 'user-service'
curl -s -X POST $KONG_ADMIN_URL/services/user-service/routes \
    -d name=refresh-token \
    -d paths[]=/refresh-token \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d tags[]=user-service > /dev/null 2>&1

# Create the 'file-manager-service' service
curl -s -X POST $KONG_ADMIN_URL/services \
    -d name=file-manager-service \
    -d host=file-manager-service \
    -d port=3000 \
    -d protocol=http \
    -d retries=5 \
    -d connect_timeout=30000 \
    -d write_timeout=60000 \
    -d read_timeout=60000 \
    -d tags[]=microservice \
    -d tags[]=file-management > /dev/null 2>&1

# Create the 'create-album' route for the 'file-manager-service'
curl -s -X POST $KONG_ADMIN_URL/services/file-manager-service/routes \
    -d name=create-album \
    -d paths[]=/albums \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d tags[]=file-manager-service > /dev/null 2>&1

# Create the 'get-active-albums' route for the 'file-manager-service'
curl -s -X GET $KONG_ADMIN_URL/services/file-manager-service/routes \
    -d name=get-active-album \
    -d paths[]=/albums \
    -d methods[]=GET \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d tags[]=file-manager-service > /dev/null 2>&1

# Create the 'get-deleted-albums' route for the 'file-manager-service'
curl -s -X GET $KONG_ADMIN_URL/services/file-manager-service/routes \
    -d name=get-deleted-album \
    -d paths[]=/albums \
    -d methods[]=GET \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d tags[]=file-manager-service > /dev/null 2>&1

# Create the 'get-album-files' route for the 'file-manager-service'
curl -s -X GET $KONG_ADMIN_URL/services/file-manager-service/routes \
    -d name=get-album-files \
    -d paths[]=/albums/{albumId}/files \
    -d methods[]=GET \
    -d https_redirect_status_code=426 \
    -d regex_priority=0 \
    -d strip_path=false \
    -d path_handling=v1 \
    -d request_buffering=true \
    -d response_buffering=true \
    -d tags[]=file-manager-service > /dev/null 2>&1

# Create the 'add-file' route for the 'file-manager-service'
curl -s -X POST $KONG_ADMIN_URL/services/file-manager-service/routes \
    -d name=add-file \
    -d paths[]=/files \
    -d methods[]=POST \
    -d https_redirect_status_code=426 \
    -d strip_path=false \
    -d request_buffering=true \
    -d response_buffering=true \
    -d tags[]=file-manager-service > /dev/null 2>&1

# Create the 'move-files' route for the 'file-manager-service'
curl -s -X PUT $KONG_ADMIN_URL/services/file-manager-service/routes \
    -d name=move-files \
    -d paths[]=/files/move \
    -d methods[]=PUT \
    -d https_redirect_status_code=426 \
    -d strip_path=false \
    -d request_buffering=true \
    -d response_buffering=true \
    -d tags[]=file-manager-service > /dev/null > /dev/null 2>&1

sleep 2

docker stop kong-database kong-migration kong 

echo "Kong configuration completed."
