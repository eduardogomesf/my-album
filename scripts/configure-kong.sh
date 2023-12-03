#!/bin/sh
# configure-kong.sh

# Kong Admin URL
KONG_ADMIN_URL=http://localhost:8001

# Create the 'customer-service' service
curl -s -X POST $KONG_ADMIN_URL/services \
    -d name=customer-service \
    -d host=localhost \
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

echo "Kong configuration completed."
