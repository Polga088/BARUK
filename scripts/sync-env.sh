#!/usr/bin/env bash
# Génère apps/*/.env avec AUTH_URL / NEXTAUTH_URL par application
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
fi

copy_app_env() {
  local app=$1
  local url=$2
  cp .env "apps/${app}/.env"
  {
    echo ""
    echo "# Overrides ${app}"
    echo "AUTH_APP_NAME=${app}"
    echo "AUTH_URL=${url}"
    echo "NEXTAUTH_URL=${url}"
  } >> "apps/${app}/.env"
}

copy_app_env web "${WEB_URL:-http://localhost:3000}"
copy_app_env owner "${OWNER_URL:-http://localhost:3001}"
copy_app_env admin "${ADMIN_URL:-http://localhost:3002}"
copy_app_env staff "${STAFF_URL:-http://localhost:3003}"

echo "Synced .env → apps/{web,owner,admin,staff}/.env"
