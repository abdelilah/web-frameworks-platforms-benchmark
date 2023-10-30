#!/bin/bash

set -e
set -a
source .env

TESTS_PATH=$(dirname "$0")/frameworks
DATA_SQL_FILE=$(dirname "$0")/data/data.sql

# Create temporary result directory in current directory
RESULT_PATH=$(pwd)/$RESULTS_FOLDER
mkdir -p $RESULT_PATH

# Start docker containers
docker compose up -d --wait

# Import mysql data
echo -e "\033[33mImporting $DATA_SQL_FILE\033[0m"
docker exec -i $(docker compose ps -q db) mariadb -u $MYSQL_USER -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < $DATA_SQL_FILE

# This function waits for the web server to be ready by continuously sending requests / and wait for 200 response code
function wait_for_web_server {
    printf "\033[33m\nWaiting for web server to be ready...\033[0m"
    until $(curl --output /dev/null --silent --head --fail http://localhost:$WEB_PORT/); do
        printf '\033[33m.\033[0m'
        sleep 1
    done
    echo -e "\033[32mWeb server is ready!\033[0m"
}

# Runs load test using ddosify tool using the URL in the first argument, then saves results in the second argument
function run_load_test {
    echo -e "\033[33mRunning load test on $1...\033[0m"
    docker run -i --rm \
        -v $1:/results \
        -v ./benchmark.js:/app/benchmark.js \
        --env-file .env \
        node:18-alpine \
        node /app/benchmark.js
}

# Run tests on each framework. We will be running container stacks one by one to avoid any interference and minimize resource usage.
for f in $TESTS_PATH/*; do
    if [ ! -f "$f/Dockerfile" ]; then
        continue
    fi

    echo -e "\033[33mRunning $f\033[0m"

    FRAMEWORK_NAME=$(basename $f)

    # Build Docker container
    CONTAINER_NAME=$FRAMEWORK_NAME-benchmark
    echo -e "\033[33mBuilding $CONTAINER_NAME...\033[0m"
    docker build -t $CONTAINER_NAME $f

    # Remove the container if it already exists
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        docker rm -f $CONTAINER_NAME
    fi
    
    # Run the container
    docker run -d \
        --rm \
        --name $CONTAINER_NAME \
        -p $WEB_PORT:80 \
        --env-file .env \
        -v $(pwd)/$RESULTS_FOLDER:/results \
        $CONTAINER_NAME

    # Create result directory for this framework
    FRAMEWORK_RESULT_PATH=$RESULT_PATH/$FRAMEWORK_NAME
    mkdir -p $FRAMEWORK_RESULT_PATH

    # Wait for web server to be ready
    wait_for_web_server

    # Run load test against /db route
    run_load_test $FRAMEWORK_RESULT_PATH $CONTAINER_NAME

    # Stop the web container
    docker stop $CONTAINER_NAME

    # Remove the image
    docker rmi $CONTAINER_NAME
done

# Bring down docker containers
docker compose down -v

# Build report
echo -e "\033[33mBuilding report...\033[0m"

docker run -i --rm \
    -v $RESULT_PATH:/results \
    -v ./build-report.js:/app/build-report.js \
    -v ./report-template.html:/report-template.html \
    node:18-alpine \
    sh -c "cd /app && node build-report.js"

echo -e "\033[32mReport generated at $RESULT_PATH/report.html\033[0m"
