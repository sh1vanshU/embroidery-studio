#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Embroo India — One-Click macOS Installer
# Double-click this file in Finder to run it
# ═══════════════════════════════════════════════════════════════

set -euo pipefail
cd "$(dirname "$0")"

RED='\033[0;31m' GREEN='\033[0;32m' GOLD='\033[0;33m' BLUE='\033[0;34m' NC='\033[0m'

echo ""
echo -e "${GOLD}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║      E M B R O O   I N D I A              ║${NC}"
echo -e "${GOLD}║      One-Click macOS Setup                 ║${NC}"
echo -e "${GOLD}╚═══════════════════════════════════════════╝${NC}"
echo ""

# ── Check Node.js ──
if ! command -v node &>/dev/null; then
  echo -e "${GOLD}[1/5]${NC} Installing Node.js via Homebrew..."
  if ! command -v brew &>/dev/null; then
    echo -e "${BLUE}→${NC} Installing Homebrew first..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
  brew install node@20
else
  NODE_V=$(node -v | sed 's/v//' | cut -d. -f1)
  echo -e "${GREEN}[1/5]${NC} Node.js v$(node -v | sed 's/v//') ✓"
fi

# ── Install dependencies ──
echo -e "${GOLD}[2/5]${NC} Installing dependencies..."
npm install --loglevel=error 2>&1 | tail -3
echo -e "${GREEN}      ✓${NC} Dependencies installed"

# ── Setup environment ──
echo -e "${GOLD}[3/5]${NC} Setting up environment..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
  echo -e "${GREEN}      ✓${NC} Created .env.local"
else
  echo -e "${GREEN}      ✓${NC} .env.local exists"
fi

# ── Build ──
echo -e "${GOLD}[4/5]${NC} Building production bundle..."
npm run build 2>&1 | tail -5
echo -e "${GREEN}      ✓${NC} Build complete"

# ── Start ──
echo -e "${GOLD}[5/5]${NC} Starting Embroo India..."
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Embroo India is ready!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BLUE}Opening${NC}: http://localhost:3000"
echo ""

# Open in browser
open http://localhost:3000 &

# Start the server (this keeps the terminal open)
npm run start
