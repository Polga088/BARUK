#!/usr/bin/env bash
# Dev local Mac — PostgreSQL Docker + apps Next.js en pnpm dev
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

echo "Starting local PostgreSQL..."
docker compose up -d postgres

echo "Waiting for postgres..."
for i in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U postgres -d baruk >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "Syncing app env files..."
./scripts/sync-env.sh

echo "Database schema..."
pnpm db:generate
pnpm db:push

if [ "${1:-}" = "--seed" ]; then
  pnpm db:seed
fi

echo ""
echo "Local stack ready."
echo "  PostgreSQL : localhost:5432"
echo "  Run apps   : pnpm dev"
echo "  Web        : http://localhost:3000"
echo "  Owner      : http://localhost:3001"
echo "  Admin      : http://localhost:3002"
echo "  Staff      : http://localhost:3003"
echo ""
echo "Tip: pnpm db:local --seed  (includes demo data)"
