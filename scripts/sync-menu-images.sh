#!/usr/bin/env bash
# Map menu image files to database (run on VPS after adding WebP/SVG to public/menu/)
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Menu images in apps/web/public/menu/:"
ls -la apps/web/public/menu/ 2>/dev/null || echo "  (empty — add images first)"

echo ""
echo "After deploy, re-seed or update imageUrl via:"
echo "  SEED_ON_DEPLOY=true ./scripts/deploy-vps.sh"
echo ""
echo "Or manually set imageUrl in Prisma Studio / admin menu CRUD."
