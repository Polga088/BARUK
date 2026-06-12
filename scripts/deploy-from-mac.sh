#!/usr/bin/env bash
# Déploie BARUK sur le VPS depuis le Mac (SSH requis)
set -euo pipefail

VPS_IP="${VPS_IP:-109.123.254.120}"
VPS_USER="${VPS_USER:-root}"
APP_DIR="/opt/baruk"
REPO="${BARUK_REPO:-https://github.com/Polga088/BARUK.git}"

echo "==> BARUK deploy → ${VPS_USER}@${VPS_IP}"

if ! ssh -o BatchMode=yes -o ConnectTimeout=10 "${VPS_USER}@${VPS_IP}" "echo ok" &>/dev/null; then
  echo "SSH impossible. Ajoutez cette clé sur le VPS (${VPS_USER} ~/.ssh/authorized_keys) :"
  echo ""
  cat "${HOME}/.ssh/id_ed25519.pub" 2>/dev/null || cat "${HOME}/.ssh/id_rsa.pub"
  echo ""
  echo "Puis relancez : ./scripts/deploy-from-mac.sh"
  exit 1
fi

ssh "${VPS_USER}@${VPS_IP}" "BARUK_REPO=${REPO} VPS_IP=${VPS_IP} bash -s" <<'REMOTE'
set -euo pipefail
APP_DIR="/opt/baruk"
REPO="${BARUK_REPO:-https://github.com/Polga088/BARUK.git}"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main
chmod +x scripts/*.sh

if [ ! -f .env ]; then
  BARUK_REPO="$REPO" VPS_IP="${VPS_IP:-109.123.254.120}" ./scripts/vps-first-deploy.sh
else
  ./scripts/deploy-vps.sh
fi
REMOTE

echo ""
echo "==> Déploiement terminé"
echo "    Web   : http://${VPS_IP}:8090"
echo "    Owner : http://${VPS_IP}:8091"
echo "    Admin : http://${VPS_IP}:8092"
echo "    Staff : http://${VPS_IP}:8093"
