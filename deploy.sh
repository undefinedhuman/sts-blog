#!/bin/sh
set -e

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

npm run changelog
wait

git remote add origin "https://${GITHUB_TOKEN}@github.com/undefinedhuman/sts-blog.git" > /dev/null 2>&1
git push -u origin master
git push origin --tags

IMAGE="undefinedhuman/sts-blog"
TAG=$(npm --loglevel silent run version)

echo "Building and tagging new Docker image: ${IMAGE}:${TAG}"

docker build -t ${IMAGE}:"${TAG}" .
docker tag ${IMAGE}:"${TAG}" ${IMAGE}:latest

echo "Logging into Docker and pushing ${IMAGE}:${TAG}"

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker push ${IMAGE}:"${TAG}"
docker push ${IMAGE}:latest