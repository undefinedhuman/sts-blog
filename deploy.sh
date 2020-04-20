#!/bin/sh
set -e

$ node changelog.js

wait

IMAGE="undefinedhuman/sts-blog"
TAG=$(npm --loglevel silent run version)

echo "Building and tagging new Docker image: ${IMAGE}:${TAG}"

docker build -t ${IMAGE}:"${TAG}" .
docker tag ${IMAGE}:"${TAG}" ${IMAGE}:latest

echo "Logging into Docker and pushing ${IMAGE}:${TAG}"

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker push ${IMAGE}:"${TAG}"
docker push ${IMAGE}:latest