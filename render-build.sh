#!/usr/bin/env bash
# exit on errors
set -o errexit

# Install dependencies (including Puppeteer)
npm install
# npm run build # Uncomment if you need to run a build step

# Define the Puppeteer cache directory
PUPPETEER_CACHE_DIR="/opt/render/.cache/puppeteer"
BUILD_CACHE_DIR="/opt/render/project/src/node_modules/.cache/puppeteer"

# Ensure Puppeteer cache directory exists
if [[ ! -d "$PUPPETEER_CACHE_DIR" ]]; then
  echo "...Creating Puppeteer cache directory"
  mkdir -p "$PUPPETEER_CACHE_DIR"
else
  echo "...Puppeteer cache directory already exists"
fi

# Store or pull Puppeteer cache using build cache
if [[ ! -d "$BUILD_CACHE_DIR" ]]; then
  echo "...Copying Puppeteer Cache from Build Cache"
  cp -R "$PUPPETEER_CACHE_DIR/" "$BUILD_CACHE_DIR/"
else
  echo "...Storing Puppeteer Cache in Build Cache"
  cp -R "$BUILD_CACHE_DIR/" "$PUPPETEER_CACHE_DIR/"
fi
