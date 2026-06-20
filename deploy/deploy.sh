#!/bin/bash
# deploy.sh — Run on VPS to pull latest code and redeploy containers
set -e

APP_DIR="/opt/educare"
REPO_URL="https://github.com/$(git remote get-url origin 2>/dev/null | sed 's/.*github.com[:/]\(.*\)\.git/\1/' || echo 'YOUR_ORG/YOUR_REPO')"
BRANCH="${1:-setup-and-testing/font-fix-test-suite-local-env}"

echo "=== Deploying EDUcare to $APP_DIR ==="

if [ ! -d "$APP_DIR/.git" ]; then
  echo "--- Cloning repo ---"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  echo "--- Pulling latest ---"
  cd "$APP_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
fi

cd "$APP_DIR/EDUCare"

echo "--- Copying .env.production ---"
cp /root/.env.production .env.production

echo "--- Stopping old containers ---"
docker compose --env-file .env.production down --remove-orphans || true

echo "--- Building and starting ---"
docker compose --env-file .env.production up --build -d

echo "--- Waiting for services ---"
sleep 15
docker compose ps

echo "=== Deploy complete. App running at http://$(curl -s ifconfig.me) ==="
