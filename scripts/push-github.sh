#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

GH="${GH_BIN:-gh}"
if ! command -v "$GH" &>/dev/null; then
  GH="/opt/homebrew/bin/gh"
fi

if ! "$GH" auth status &>/dev/null; then
  echo "GitHub CLI non connecté. Exécutez :"
  echo "  gh auth login -h github.com -p https -w"
  exit 1
fi

if git remote get-url origin &>/dev/null; then
  echo "Remote origin déjà configuré."
  git push -u origin main
else
  "$GH" repo create Polga088/BARUK --public --source=. --remote=origin --push \
    --description "BARUK — plateforme restaurant (web, owner, admin, staff)"
fi

echo ""
echo "Dépôt : https://github.com/Polga088/BARUK"
