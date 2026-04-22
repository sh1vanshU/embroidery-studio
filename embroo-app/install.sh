#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Embroo India — One-Command Setup Script
# Usage: chmod +x install.sh && ./install.sh [--dev|--production]
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GOLD='\033[0;33m'
NC='\033[0m' # No Color

# Config
NODE_MIN_VERSION=20
NPM_MIN_VERSION=9
APP_PORT=3000
MODE="${1:---dev}"  # Default to dev mode

# ═══════════════════════════════════════════
# Helper Functions
# ═══════════════════════════════════════════

log_step() {
  echo -e "\n${GOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GOLD}  $1${NC}"
  echo -e "${GOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

log_ok() {
  echo -e "  ${GREEN}✓${NC} $1"
}

log_warn() {
  echo -e "  ${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "  ${RED}✗${NC} $1"
}

log_info() {
  echo -e "  ${BLUE}→${NC} $1"
}

version_gte() {
  # Returns 0 (true) if $1 >= $2
  printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# ═══════════════════════════════════════════
# Banner
# ═══════════════════════════════════════════

echo -e "${GOLD}"
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║                                           ║"
echo "  ║          E M B R O O   I N D I A          ║"
echo "  ║    Custom Embroidery, Reimagined           ║"
echo "  ║                                           ║"
echo "  ║    Setup Script v1.0                       ║"
echo "  ║    Mode: ${MODE}                           "
echo "  ║                                           ║"
echo "  ╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# ═══════════════════════════════════════════
# Step 1: Check OS
# ═══════════════════════════════════════════

log_step "Step 1/9: Detecting Operating System"

OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  if command -v apt-get &> /dev/null; then
    OS="debian"
    log_ok "Detected: Ubuntu/Debian Linux"
  elif command -v yum &> /dev/null; then
    OS="redhat"
    log_ok "Detected: CentOS/Amazon Linux"
  else
    OS="linux"
    log_ok "Detected: Linux (generic)"
  fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
  OS="macos"
  log_ok "Detected: macOS"
else
  log_warn "Unknown OS: $OSTYPE — proceeding anyway"
fi

# ═══════════════════════════════════════════
# Step 2: Check/Install Node.js
# ═══════════════════════════════════════════

log_step "Step 2/9: Checking Node.js (minimum v${NODE_MIN_VERSION})"

install_node() {
  log_info "Installing Node.js v${NODE_MIN_VERSION}..."

  if [[ "$OS" == "debian" ]]; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_MIN_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif [[ "$OS" == "redhat" ]]; then
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_MIN_VERSION}.x | sudo bash -
    sudo yum install -y nodejs
  elif [[ "$OS" == "macos" ]]; then
    if command -v brew &> /dev/null; then
      brew install node@${NODE_MIN_VERSION}
    else
      log_error "Homebrew not found. Install Node.js manually: https://nodejs.org"
      log_info "Or install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"
      exit 1
    fi
  else
    log_error "Cannot auto-install Node.js on this OS."
    log_info "Install manually from: https://nodejs.org"
    exit 1
  fi
}

if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if version_gte "$NODE_VERSION" "$NODE_MIN_VERSION"; then
    log_ok "Node.js v$(node -v | sed 's/v//') found"
  else
    log_warn "Node.js v$(node -v | sed 's/v//') is too old (need v${NODE_MIN_VERSION}+)"
    install_node
  fi
else
  log_warn "Node.js not found"
  install_node
fi

# Verify node after install
if ! command -v node &> /dev/null; then
  log_error "Node.js installation failed. Please install manually."
  exit 1
fi
log_ok "Node.js v$(node -v | sed 's/v//') ready"

# ═══════════════════════════════════════════
# Step 3: Check npm
# ═══════════════════════════════════════════

log_step "Step 3/9: Checking npm (minimum v${NPM_MIN_VERSION})"

if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v | cut -d. -f1)
  if version_gte "$NPM_VERSION" "$NPM_MIN_VERSION"; then
    log_ok "npm v$(npm -v) found"
  else
    log_info "Upgrading npm..."
    npm install -g npm@latest
    log_ok "npm upgraded to v$(npm -v)"
  fi
else
  log_error "npm not found. It should come with Node.js."
  exit 1
fi

# ═══════════════════════════════════════════
# Step 4: Check git
# ═══════════════════════════════════════════

log_step "Step 4/9: Checking git"

if command -v git &> /dev/null; then
  log_ok "git v$(git --version | awk '{print $3}') found"
else
  log_warn "git not found — installing..."
  if [[ "$OS" == "debian" ]]; then
    sudo apt-get install -y git
  elif [[ "$OS" == "redhat" ]]; then
    sudo yum install -y git
  elif [[ "$OS" == "macos" ]]; then
    xcode-select --install 2>/dev/null || true
  fi
  log_ok "git installed"
fi

# ═══════════════════════════════════════════
# Step 5: Install npm dependencies
# ═══════════════════════════════════════════

log_step "Step 5/9: Installing npm dependencies"

# Navigate to script directory (in case run from elsewhere)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log_info "Working directory: $(pwd)"

if [ -f "package.json" ]; then
  log_info "Found package.json — installing dependencies..."
  npm install 2>&1 | tail -5
  log_ok "All dependencies installed ($(ls node_modules/ | wc -l | tr -d ' ') packages)"
else
  log_error "package.json not found! Are you in the right directory?"
  exit 1
fi

# ═══════════════════════════════════════════
# Step 6: Setup environment
# ═══════════════════════════════════════════

log_step "Step 6/9: Setting up environment"

if [ ! -f ".env.local" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env.local
    log_ok "Created .env.local from .env.example"
    log_warn "Edit .env.local with your actual values before going to production!"
  else
    log_warn "No .env.example found — creating minimal .env.local"
    cat > .env.local << 'ENVEOF'
# Embroo India — Environment Variables
# Generated by install.sh

# Site URL (change to your domain in production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ── Phase 4: Database & Auth ──
# DATABASE_URL=postgresql://user:password@localhost:5432/embroo
# NEXTAUTH_SECRET=generate-a-random-32-char-string-here
# NEXTAUTH_URL=http://localhost:3000

# ── Phase 5: Payments ──
# RAZORPAY_KEY_ID=rzp_test_xxxxx
# RAZORPAY_KEY_SECRET=xxxxx

# ── Phase 4: File Storage ──
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=xxxxx
# CLOUDINARY_API_SECRET=xxxxx

# ── Phase 4: AI ──
# OPENAI_API_KEY=sk-xxxxx

# ── Phase 5: Email ──
# RESEND_API_KEY=re_xxxxx

# ── Phase 6: Monitoring ──
# SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
ENVEOF
    log_ok "Created .env.local with placeholder values"
  fi
else
  log_ok ".env.local already exists — skipping"
fi

# ═══════════════════════════════════════════
# Step 7: Type check
# ═══════════════════════════════════════════

log_step "Step 7/9: Running TypeScript type check"

if npx tsc --noEmit 2>&1; then
  log_ok "TypeScript — zero errors"
else
  log_warn "TypeScript has errors — check the output above"
  log_info "This won't block the build but should be fixed"
fi

# ═══════════════════════════════════════════
# Step 8: Lint check
# ═══════════════════════════════════════════

log_step "Step 8/9: Running ESLint"

if npm run lint 2>&1; then
  log_ok "ESLint — zero warnings"
else
  log_warn "ESLint has warnings — check the output above"
fi

# ═══════════════════════════════════════════
# Step 9: Build & Start
# ═══════════════════════════════════════════

log_step "Step 9/9: Building & Starting"

if [[ "$MODE" == "--production" || "$MODE" == "--prod" ]]; then
  log_info "Building production bundle..."
  npm run build 2>&1 | tail -15
  log_ok "Production build complete"

  # Check if PM2 is available for process management
  if command -v pm2 &> /dev/null; then
    log_info "Starting with PM2 process manager..."
    pm2 delete embroo-app 2>/dev/null || true
    pm2 start npm --name "embroo-app" -- start
    pm2 save
    log_ok "App running via PM2 on port ${APP_PORT}"
    log_info "Useful PM2 commands:"
    log_info "  pm2 logs embroo-app    — View logs"
    log_info "  pm2 restart embroo-app — Restart app"
    log_info "  pm2 stop embroo-app    — Stop app"
    log_info "  pm2 status             — Check status"
  else
    log_warn "PM2 not found — installing globally for process management..."
    npm install -g pm2
    pm2 start npm --name "embroo-app" -- start
    pm2 save
    pm2 startup 2>/dev/null || true
    log_ok "App running via PM2 on port ${APP_PORT}"
  fi

elif [[ "$MODE" == "--build-only" ]]; then
  log_info "Building production bundle (not starting)..."
  npm run build 2>&1 | tail -15
  log_ok "Production build complete in .next/"
  log_info "Run 'npm start' to serve the production build"

else
  # Dev mode
  log_info "Starting development server..."
  log_ok "Dev server starting on http://localhost:${APP_PORT}"
  echo ""
  npm run dev
fi

# ═══════════════════════════════════════════
# Done!
# ═══════════════════════════════════════════

echo ""
echo -e "${GOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BLUE}App URL:${NC}        http://localhost:${APP_PORT}"
echo -e "  ${BLUE}Mode:${NC}           ${MODE}"
echo -e "  ${BLUE}Node:${NC}           $(node -v)"
echo -e "  ${BLUE}npm:${NC}            v$(npm -v)"
echo -e "  ${BLUE}Next.js:${NC}        $(npx next --version 2>/dev/null || echo 'check package.json')"
echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo -e "    1. Open http://localhost:${APP_PORT} in your browser"
echo -e "    2. Edit .env.local with your actual API keys"
echo -e "    3. Read README.md for full documentation"
echo ""
