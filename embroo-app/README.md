# Embroo India — Custom Embroidery Platform

> India's first 3D embroidery studio. Design custom embroidered hoodies, t-shirts, polos and more.

**Domain**: embroo.in  
**Stack**: Next.js 16 + TypeScript + Tailwind CSS v4 + Three.js + Zustand  
**Status**: Phase 1 Complete (Landing Page)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [One-Command Setup](#one-command-setup)
3. [Manual Setup (Step by Step)](#manual-setup-step-by-step)
4. [Project Structure](#project-structure)
5. [Available Scripts](#available-scripts)
6. [Environment Variables](#environment-variables)
7. [Deployment](#deployment)
8. [Tech Stack](#tech-stack)
9. [Architecture](#architecture)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Clone and run (if on a fresh server)
chmod +x install.sh
./install.sh

# Or manually
npm install
npm run dev
```

Open http://localhost:3000

---

## One-Command Setup

Run the `install.sh` script. It handles everything from a fresh Ubuntu/macOS machine:

```bash
chmod +x install.sh
./install.sh
```

What it does:
1. Checks and installs system prerequisites (Node.js 20+, npm, git)
2. Installs all npm dependencies
3. Creates `.env.local` from `.env.example` (if not exists)
4. Runs TypeScript type checking
5. Runs ESLint
6. Builds the production bundle
7. Starts the production server on port 3000

For **development mode** instead:
```bash
chmod +x install.sh
./install.sh --dev
```

---

## Manual Setup (Step by Step)

### Prerequisites

| Software | Minimum Version | Check Command |
|----------|----------------|---------------|
| Node.js | 20.0.0 | `node -v` |
| npm | 9.0.0 | `npm -v` |
| git | 2.0.0 | `git --version` |

### Step 1: Install Node.js (if not installed)

**macOS:**
```bash
# Using Homebrew
brew install node@20

# Or using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Amazon Linux / CentOS:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### Step 2: Clone the Repository

```bash
git clone <your-private-repo-url> embroo-app
cd embroo-app
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs all packages defined in `package.json`:
- **Runtime**: next, react, react-dom, zustand, framer-motion, three, @react-three/fiber, @react-three/drei, zod, react-hook-form
- **Dev**: tailwindcss, typescript, eslint, @types/*

### Step 4: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values (see [Environment Variables](#environment-variables)).

### Step 5: Verify Setup

```bash
# Type check
npx tsc --noEmit

# Lint check
npm run lint

# Build check
npm run build
```

All three should pass with zero errors.

### Step 6: Run the App

**Development** (hot reload, source maps, verbose errors):
```bash
npm run dev
# → http://localhost:3000
```

**Production** (optimized, minified, fast):
```bash
npm run build
npm run start
# → http://localhost:3000
```

---

## Project Structure

```
embroo-app/
├── install.sh              # One-command setup script
├── .env.example            # Environment variable template
├── .env.local              # Your local secrets (git-ignored)
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config
├── next.config.ts          # Next.js config (security headers, redirects)
├── postcss.config.mjs      # PostCSS + Tailwind CSS v4
├── eslint.config.mjs       # ESLint rules
│
├── public/                 # Static assets (served at /)
│   ├── models/             # 3D garment models (.glb) [Phase 3]
│   ├── textures/           # Fabric textures [Phase 3]
│   ├── patches/            # Patch library images [Phase 2]
│   └── fonts/              # Custom embroidery fonts [Phase 2]
│
├── src/
│   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── layout.tsx      # Root layout (fonts, metadata, noise overlay)
│   │   ├── page.tsx        # Landing page (/) — all 9 sections
│   │   ├── globals.css     # Tailwind theme + custom CSS + animations
│   │   ├── builder/
│   │   │   └── page.tsx    # Garment builder (/builder) [Phase 2]
│   │   ├── auth/           # Login & register pages [Phase 4]
│   │   ├── account/        # User dashboard [Phase 4]
│   │   └── api/            # API routes [Phase 4]
│   │
│   ├── components/
│   │   ├── ui/             # Atomic design system
│   │   │   ├── Button.tsx         # Primary/outline/sm variants
│   │   │   ├── SectionHeader.tsx  # Label + title + gold line
│   │   │   └── RevealOnScroll.tsx # Intersection Observer animation
│   │   │
│   │   ├── layout/         # Site-wide layout
│   │   │   ├── SiteHeader.tsx     # Sticky header (top-bar, logo, search, promo)
│   │   │   └── Footer.tsx         # 4-col footer with payments & social
│   │   │
│   │   ├── landing/        # Landing page sections
│   │   │   ├── HeroSection.tsx       # Thread particles, SVG hoodie, CTAs
│   │   │   ├── HowItWorks.tsx        # 3-step process
│   │   │   ├── ProductShowcase.tsx   # 4 garment cards
│   │   │   ├── BestSellers.tsx       # Horizontal carousel
│   │   │   ├── WhyEmbroo.tsx         # 6 feature cards
│   │   │   ├── CustomerGallery.tsx   # Photo gallery scroll
│   │   │   ├── Testimonials.tsx      # 3 review cards
│   │   │   ├── Newsletter.tsx        # Email signup
│   │   │   └── svg/
│   │   │       └── HoodieOutline.tsx # Animated hero SVG
│   │   │
│   │   ├── builder/        # Garment builder [Phase 2]
│   │   │   ├── materials/  # Color pickers
│   │   │   ├── designs/    # Zone grid, type chooser
│   │   │   ├── editors/    # 9 design editors
│   │   │   ├── shared/     # Font picker, thread colors, etc.
│   │   │   └── preview/    # SVG/3D garment preview
│   │   │
│   │   ├── 3d/            # Three.js components [Phase 3]
│   │   ├── cart/           # Cart sidebar [Phase 5]
│   │   ├── auth/           # Login/register forms [Phase 4]
│   │   └── checkout/       # Checkout flow [Phase 5]
│   │
│   ├── stores/             # Zustand state stores [Phase 2]
│   │   ├── builderStore.ts # Builder state (garment, colors, zones, designs)
│   │   ├── cartStore.ts    # Shopping cart
│   │   └── uiStore.ts      # UI state (modals, sidebar)
│   │
│   ├── types/
│   │   └── index.ts        # All TypeScript interfaces
│   │
│   ├── lib/
│   │   ├── constants.ts    # Colors, zones, prices, testimonials, nav links
│   │   └── utils.ts        # formatINR, calculatePrice, cn helper
│   │
│   └── hooks/              # Custom React hooks [Phase 2+]
│
└── prisma/                 # Database schema [Phase 4]
    └── schema.prisma
```

---

## Available Scripts

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (http://localhost:3000) |
| `npm run build` | Create optimized production build in `.next/` |
| `npm run start` | Start production server (run `build` first) |
| `npm run lint` | Run ESLint to check code quality |
| `npx tsc --noEmit` | Run TypeScript type checker without emitting files |

---

## Environment Variables

Create `.env.local` from the template:
```bash
cp .env.example .env.local
```

| Variable | Required | Description | Phase |
|----------|----------|-------------|-------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your domain (e.g., https://embroo.in) | 1 |
| `DATABASE_URL` | Phase 4 | PostgreSQL connection string | 4 |
| `NEXTAUTH_SECRET` | Phase 4 | Random 32+ char string for JWT signing | 4 |
| `NEXTAUTH_URL` | Phase 4 | Your domain URL | 4 |
| `GOOGLE_CLIENT_ID` | Phase 4 | Google OAuth client ID | 4 |
| `GOOGLE_CLIENT_SECRET` | Phase 4 | Google OAuth client secret | 4 |
| `RAZORPAY_KEY_ID` | Phase 5 | Razorpay API key ID | 5 |
| `RAZORPAY_KEY_SECRET` | Phase 5 | Razorpay API secret | 5 |
| `CLOUDINARY_CLOUD_NAME` | Phase 4 | Cloudinary account name | 4 |
| `CLOUDINARY_API_KEY` | Phase 4 | Cloudinary API key | 4 |
| `CLOUDINARY_API_SECRET` | Phase 4 | Cloudinary API secret | 4 |
| `OPENAI_API_KEY` | Phase 4 | OpenAI key for AI patch generation | 4 |
| `RESEND_API_KEY` | Phase 5 | Resend API key for transactional email | 5 |
| `SENTRY_DSN` | Phase 6 | Sentry error tracking DSN | 6 |

**Important**: Never commit `.env.local`. It's already in `.gitignore`.

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard:
# → Project Settings → Environment Variables
```

### Option 2: Any VPS (Ubuntu/Debian)

```bash
# On your server:
git clone <repo-url> /var/www/embroo-app
cd /var/www/embroo-app
chmod +x install.sh
./install.sh --production

# This will:
# 1. Install Node.js if needed
# 2. Install deps
# 3. Build the app
# 4. Start with PM2 process manager
```

### Option 3: Docker

```bash
docker build -t embroo-app .
docker run -p 3000:3000 --env-file .env.local embroo-app
```

### Option 4: AWS / GCP / Azure

Use the `install.sh` script on any Linux VM, then put Nginx in front:

```nginx
server {
    listen 80;
    server_name embroo.in www.embroo.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.2 | App Router, SSR, SSG, API routes |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| 3D Engine | Three.js + R3F | 0.183 | 3D garment preview |
| State | Zustand | 5.x | Client-side state management |
| Animation | Framer Motion | 12.x | Page transitions, reveals |
| Forms | React Hook Form + Zod | 7.x / 4.x | Validation |
| Database | PostgreSQL + Prisma | — | Data persistence [Phase 4] |
| Auth | NextAuth.js | — | Authentication [Phase 4] |
| Payments | Razorpay | — | Indian payments [Phase 5] |
| Storage | Cloudinary | — | Image uploads [Phase 4] |
| AI | OpenAI DALL-E 3 | — | AI patch generation [Phase 4] |
| Email | Resend | — | Transactional email [Phase 5] |
| Hosting | Vercel | — | Edge deployment |
| Monitoring | Sentry | — | Error tracking [Phase 6] |

---

## Architecture

### Pages & Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Landing page (9 sections) | Done |
| `/builder` | Garment customization builder | Phase 2 |
| `/builder?garment=hoodie` | Builder with garment pre-selected | Phase 2 |
| `/auth/login` | User login | Phase 4 |
| `/auth/register` | User registration | Phase 4 |
| `/account` | User dashboard | Phase 4 |
| `/account/designs` | Saved designs gallery | Phase 4 |
| `/account/orders` | Order history | Phase 4 |
| `/checkout` | Cart & checkout flow | Phase 5 |
| `/bulk-orders` | Bulk order request form | Phase 5 |
| `/admin` | Admin dashboard | Phase 6 |

### State Management

```
Zustand Stores:
  builderStore  → garment type, colors, zones, designs, pricing
  cartStore     → cart items, quantities, totals
  uiStore       → modals, sidebar, mobile menu

All stores use:
  - persist middleware (localStorage backup)
  - immer middleware (immutable updates)
  - temporal middleware (undo/redo in builder)
```

### Data Flow

```
User Action → Zustand Store → React Component Re-render → SVG/3D Update
                    ↓
              localStorage (auto-save)
                    ↓
              API Route (when saving/ordering) [Phase 4+]
                    ↓
              PostgreSQL via Prisma [Phase 4+]
```

---

## Troubleshooting

### Common Issues

**1. `npm install` fails with ERESOLVE**
```bash
npm install --legacy-peer-deps
```

**2. Build fails with "Module not found"**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**3. Fonts not loading**
- The app uses `next/font` which downloads fonts at build time
- If behind a corporate proxy, set `NODE_TLS_REJECT_UNAUTHORIZED=0` (dev only!)
- In production, fonts are self-hosted from `.next/static`

**4. Port 3000 already in use**
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

**5. TypeScript errors after pulling new code**
```bash
# Regenerate types
npx tsc --noEmit
# If persistent, delete tsconfig.tsbuildinfo
rm -f tsconfig.tsbuildinfo
```

**6. Tailwind classes not working**
```bash
# Ensure postcss config exists
cat postcss.config.mjs
# Should contain: @tailwindcss/postcss plugin
```

### Getting Help

- Check logs: `cat .next/trace` or browser console
- Next.js docs: https://nextjs.org/docs
- Tailwind v4 docs: https://tailwindcss.com/docs
- Open an issue in the private repo

---

## Development Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Project foundation + landing page | **Done** |
| 2 | Garment builder (panels, editors, SVG preview) | Planned |
| 3 | 3D preview engine (Three.js) | Planned |
| 4 | Backend, auth, database | Planned |
| 5 | E-commerce, cart, Razorpay payments | Planned |
| 6 | Admin, templates, sharing, polish | Planned |

---

## License

Proprietary. All rights reserved. Embroo India.
