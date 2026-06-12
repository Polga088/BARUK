#!/usr/bin/env bash
# Premier déploiement BARUK sur VPS (à exécuter SUR le serveur en root)
# Coexistence CRM Texta : ports 8080-8083 (comme Immg sur 8080)
set -euo pipefail

APP_DIR="/opt/baruk"
# Remplacer par votre dépôt Git quand disponible
REPO="${BARUK_REPO:-}"

VPS_IP="${VPS_IP:-109.123.254.120}"

echo "==> BARUK — first deploy on $(hostname)"

if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  apt-get update && apt-get install -y git curl
  curl -fsSL https://get.docker.com | sh
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

WEB_PORT=8080
OWNER_PORT=8081
ADMIN_PORT=8082
STAFF_PORT=8083

WEB_URL=http://${VPS_IP}:8080
OWNER_URL=http://${VPS_IP}:8081
ADMIN_URL=http://${VPS_IP}:8082
STAFF_URL=http://${VPS_IP}:8083

NEXT_PUBLIC_OWNER_URL=http://${VPS_IP}:8081
NEXT_PUBLIC_ADMIN_URL=http://${VPS_IP}:8082
NEXT_PUBLIC_STAFF_URL=http://${VPS_IP}:8083

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
echo "    Web   : http://${VPS_IP}:8080"
echo "    Owner : http://${VPS_IP}:8081  (owner@baruk.ma / owner123 after seed)"
echo "    Admin : http://${VPS_IP}:8082  (admin@baruk.ma / admin123)"
echo "    Staff : http://${VPS_IP}:8083  (serveur@baruk.ma / staff123)"
echo ""
echo "==> HTTPS (optionnel, domaine requis) :"
echo "    deploy/nginx/baruk-subdomains.conf.template → nginx système + certbot"
