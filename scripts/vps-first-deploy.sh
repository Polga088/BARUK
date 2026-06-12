#!/usr/bin/env bash
# Premier déploiement BARUK sur VPS (à exécuter SUR le serveur en root)
# Coexistence CRM Texta : ports 8080-8083 (comme Immg sur 8080)
set -euo pipefail

APP_DIR="/opt/baruk"
REPO="${BARUK_REPO:-https://github.com/Polga088/BARUK.git}"

VPS_IP="${VPS_IP:-109.123.254.120}"

# 8090-8093 : coexistence avec Immg (8080) et CRM (80/443)
WEB_PORT="${WEB_PORT:-8090}"
OWNER_PORT="${OWNER_PORT:-8091}"
ADMIN_PORT="${ADMIN_PORT:-8092}"
STAFF_PORT="${STAFF_PORT:-8093}"

echo "==> BARUK — first deploy on $(hostname)"

if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  apt-get update && apt-get install -y git curl
  curl -fsSL https://get.docker.com | sh
fi

if command -v ufw &>/dev/null; then
  ufw allow 22/tcp || true
  ufw allow "${WEB_PORT}"/tcp || true
  ufw allow "${OWNER_PORT}"/tcp || true
  ufw allow "${ADMIN_PORT}"/tcp || true
  ufw allow "${STAFF_PORT}"/tcp || true
fi

if [ -n "$REPO" ]; then
  if [ ! -d "$APP_DIR" ]; then
    git clone "$REPO" "$APP_DIR"
  else
    cd "$APP_DIR" && git pull
  fi
else
  echo "BARUK_REPO non défini — copiez le projet manuellement dans ${APP_DIR}"
  mkdir -p "$APP_DIR"
fi

cd "$APP_DIR"

if [ ! -f .env ]; then
  POSTGRES_PASSWORD=$(openssl rand -hex 16)
  AUTH_SECRET=$(openssl rand -hex 32)
  cat > .env <<EOF
NODE_ENV=production
VPS_HOST=${VPS_IP}

WEB_PORT=${WEB_PORT}
OWNER_PORT=${OWNER_PORT}
ADMIN_PORT=${ADMIN_PORT}
STAFF_PORT=${STAFF_PORT}

WEB_URL=http://${VPS_IP}:${WEB_PORT}
OWNER_URL=http://${VPS_IP}:${OWNER_PORT}
ADMIN_URL=http://${VPS_IP}:${ADMIN_PORT}
STAFF_URL=http://${VPS_IP}:${STAFF_PORT}

NEXT_PUBLIC_OWNER_URL=http://${VPS_IP}:${OWNER_PORT}
NEXT_PUBLIC_ADMIN_URL=http://${VPS_IP}:${ADMIN_PORT}
NEXT_PUBLIC_STAFF_URL=http://${VPS_IP}:${STAFF_PORT}

POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
DATABASE_URL=postgresql://baruk:${POSTGRES_PASSWORD}@postgres:5432/baruk?schema=public
AUTH_SECRET=${AUTH_SECRET}

NEXT_PUBLIC_ORG_SLUG=baruk
NEXT_PUBLIC_BRANCH_SLUG=casablanca-centre
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

SEED_ON_DEPLOY=true
EOF
  echo ".env created with generated secrets."
fi

chmod +x scripts/*.sh
SEED_ON_DEPLOY=true ./scripts/deploy-vps.sh

echo ""
echo "==> BARUK live on VPS"
echo "    Web   : http://${VPS_IP}:${WEB_PORT}"
echo "    Owner : http://${VPS_IP}:${OWNER_PORT}  (owner@baruk.ma / owner123 after seed)"
echo "    Admin : http://${VPS_IP}:${ADMIN_PORT}  (admin@baruk.ma / admin123)"
echo "    Staff : http://${VPS_IP}:${STAFF_PORT}  (serveur@baruk.ma / staff123)"
echo ""
echo "==> HTTPS (optionnel, domaine requis) :"
echo "    deploy/nginx/baruk-subdomains.conf.template → nginx système + certbot"
