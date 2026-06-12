#!/usr/bin/env bash
# Déploiement / mise à jour sur VPS (à exécuter SUR le serveur dans /opt/baruk)
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing .env — copy .env.production.example to .env and edit secrets/URLs"
  exit 1
fi

# shellcheck disable=SC1091
source .env

echo "==> BARUK — build & deploy"

docker compose -f docker-compose.prod.yml build web owner admin staff

echo "==> Starting postgres..."
docker compose -f docker-compose.prod.yml up -d postgres
sleep 6

echo "==> Database push..."
NETWORK=$(docker network ls --format '{{.Name}}' | grep baruk-internal | head -1)
docker run --rm \
  --network "${NETWORK}" \
  -v "$(pwd):/app" -w /app \
  -e DATABASE_URL="postgresql://baruk:${POSTGRES_PASSWORD}@postgres:5432/baruk?schema=public" \
  node:22-alpine sh -c "
    corepack enable && corepack prepare pnpm@10.19.0 --activate
    pnpm install --frozen-lockfile
    pnpm db:generate
    pnpm db:push
  "

if [ "${SEED_ON_DEPLOY:-false}" = "true" ]; then
  echo "==> Seeding database..."
  docker run --rm \
    --network "${NETWORK}" \
    -v "$(pwd):/app" -w /app \
    -e DATABASE_URL="postgresql://baruk:${POSTGRES_PASSWORD}@postgres:5432/baruk?schema=public" \
    node:22-alpine sh -c "
      corepack enable && corepack prepare pnpm@10.19.0 --activate
      pnpm install --frozen-lockfile
      pnpm db:seed
    "
fi

echo "==> Starting all services..."
docker compose -f docker-compose.prod.yml up -d

sleep 4
docker compose -f docker-compose.prod.yml ps

echo ""
echo "==> Deploy complete"
echo "  Web   : ${WEB_URL:-http://localhost:8080}"
echo "  Owner : ${OWNER_URL:-http://localhost:8081}"
echo "  Admin : ${ADMIN_URL:-http://localhost:8082}"
echo "  Staff : ${STAFF_URL:-http://localhost:8083}"
echo ""
echo "Health: curl ${WEB_URL:-http://localhost:8080}/api/health"
