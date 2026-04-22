# Embroo India — Beginner's Complete Setup Guide

This guide explains **everything from scratch** — what each tool is, why we need it, and how to use it. Written for someone who is new to web development.

---

## What Are We Building?

A **website** where customers can:
1. Browse embroidered clothing (hoodies, t-shirts, polos, caps)
2. **Design their own** embroidery using an interactive builder tool
3. See a **3D preview** of their design on the garment
4. **Try it on** using their webcam (AR)
5. Pay and get it delivered

Think of it like a custom pizza builder, but for embroidered clothing.

---

## What is What? (Glossary for Beginners)

| Term | What It Is | Analogy |
|------|-----------|---------|
| **Node.js** | JavaScript runtime for your computer | Like Python, but for JavaScript |
| **npm** | Package manager (comes with Node.js) | Like pip for Python, or an app store for code |
| **Next.js** | Our web framework (makes websites) | Like Django/Flask for Python |
| **React** | UI library (makes interactive buttons, forms, etc.) | Like LEGO blocks for web pages |
| **TypeScript** | JavaScript with type checking | Like JavaScript with a spell checker |
| **Tailwind CSS** | Utility CSS framework | Pre-made styles instead of writing CSS from scratch |
| **Three.js** | 3D graphics library | Renders the 3D hoodie preview |
| **Zustand** | State manager | Remembers what color/design the user picked |
| **Git** | Version control | Like "Track Changes" in Google Docs for code |
| **Vercel** | Hosting platform | Where your website lives on the internet |
| **PostgreSQL** | Database | Stores users, orders, designs |
| **Razorpay** | Payment gateway | Handles UPI/card payments |

---

## Step-by-Step: Setting Up on Your Computer

### 1. Install Node.js

Node.js is the engine that runs our app. Think of it as the "electricity" for our code.

**On macOS:**
```bash
# Option A: Download installer from https://nodejs.org (easiest)
# Click "20.x LTS" button, download, double-click to install

# Option B: Using Homebrew (if you have it)
brew install node@20
```

**On Windows:**
```
1. Go to https://nodejs.org
2. Download the LTS version
3. Run the installer (click Next, Next, Next, Install)
4. Restart your terminal/command prompt
```

**On Ubuntu/Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify it worked:**
```bash
node -v    # Should show v20.x.x or higher
npm -v     # Should show 9.x.x or higher
```

If both commands show version numbers, you're good!

---

### 2. Get the Code

**If you have the code as a zip file:**
```bash
# Unzip it
unzip embroo-app.zip
cd embroo-app
```

**If you have it in a git repository:**
```bash
git clone <your-repo-url>
cd embroo-app
```

**If you're copying from this computer:**
```bash
# The code is at:
cd /Users/shivanshugupta/Downloads/embroidery-studio/embroo-app
```

---

### 3. Install Dependencies

This downloads all the libraries/packages our app needs. Think of it like downloading all the apps your phone needs.

```bash
npm install
```

**What happens:** npm reads `package.json` (our "shopping list" of packages) and downloads everything into a `node_modules/` folder. This folder is ~200MB — that's normal.

**If it fails:** Try these one at a time:
```bash
npm install --legacy-peer-deps     # Ignore version conflicts
npm cache clean --force && npm install  # Clear cache first
```

---

### 4. Set Up Environment Variables

Environment variables are **secret settings** (API keys, passwords) that we don't put in the code.

```bash
cp .env.example .env.local
```

This creates a `.env.local` file from our template. For now, the defaults work fine for development. You'll fill in real values later when adding payments, auth, etc.

**Important:** `.env.local` is listed in `.gitignore`, so it will NEVER be uploaded to git. This protects your secrets.

---

### 5. Run the App (Development Mode)

```bash
npm run dev
```

**What happens:**
1. Next.js compiles your code
2. Starts a local web server
3. Opens on http://localhost:3000

**Open your browser** and go to: **http://localhost:3000**

You should see the Embroo India landing page with the dark+gold theme!

**To stop the server:** Press `Ctrl + C` in the terminal.

---

### 6. Run the App (Production Mode)

Production mode is optimized — faster, smaller, ready for real users.

```bash
npm run build    # Step 1: Compile everything (takes 10-30 seconds)
npm run start    # Step 2: Start the optimized server
```

Or use the one-command script:
```bash
./install.sh --production
```

---

## Understanding the File Structure

Here's what every important file does:

```
embroo-app/
│
├── package.json          ← Lists all dependencies + scripts
│                           (like a recipe listing ingredients)
│
├── tsconfig.json         ← TypeScript settings
│                           (you rarely need to touch this)
│
├── next.config.ts        ← Next.js settings
│                           (security headers, redirects)
│
├── postcss.config.mjs    ← PostCSS settings (needed for Tailwind)
│
├── install.sh            ← One-command setup script
│
├── .env.example          ← Template for secret variables
├── .env.local            ← YOUR actual secret variables (git-ignored)
├── .gitignore            ← Files git should ignore
│
├── public/               ← Static files served directly
│   └── (images, 3D models go here later)
│
└── src/                  ← All our actual code
    │
    ├── app/              ← PAGES (each folder = a URL)
    │   ├── layout.tsx    ← Wraps every page (fonts, metadata)
    │   ├── page.tsx      ← Homepage (/) 
    │   ├── globals.css   ← Global styles + theme colors
    │   └── builder/
    │       └── page.tsx  ← Builder page (/builder)
    │
    ├── components/       ← REUSABLE PIECES
    │   ├── ui/           ← Small pieces (buttons, toggles)
    │   ├── layout/       ← Header, Footer
    │   ├── landing/      ← Landing page sections
    │   └── builder/      ← Builder tool pieces (Phase 2)
    │
    ├── types/            ← TypeScript type definitions
    │   └── index.ts      ← All our data shapes
    │
    ├── lib/              ← HELPER CODE
    │   ├── constants.ts  ← All data (colors, prices, zones)
    │   └── utils.ts      ← Helper functions
    │
    ├── stores/           ← STATE MANAGEMENT (Phase 2)
    │   └── (builder state, cart state)
    │
    └── hooks/            ← CUSTOM HOOKS (Phase 2+)
```

---

## Common Commands You'll Use

### Daily Development

```bash
# Start working
cd /path/to/embroo-app
npm run dev                    # Start dev server
# → Open http://localhost:3000

# When you make changes, the page auto-refreshes!
# Press Ctrl+C to stop
```

### Check for Errors

```bash
npm run lint                   # Check code quality
npx tsc --noEmit               # Check TypeScript types
```

### Install a New Package

```bash
npm install package-name       # Install and add to package.json
npm install -D package-name    # Install as dev-only dependency
```

### Update Packages

```bash
npm update                     # Update all packages
npm audit                      # Check for security issues
npm audit fix                  # Auto-fix security issues
```

### Git (Version Control)

```bash
git status                     # See what files changed
git add .                      # Stage all changes
git commit -m "description"    # Save a checkpoint
git push                       # Upload to remote repo
git pull                       # Download latest changes
git log --oneline              # See commit history
```

---

## How to Deploy to a Server

### Option A: Vercel (Easiest — Free Tier Available)

Vercel is made by the same people who made Next.js. It's the easiest option.

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Follow the prompts
# It will ask: Set up and deploy? → Yes
# Which scope? → Your account
# Link to existing project? → No
# Project name? → embroo-app
# Directory? → ./
# Override settings? → No

# 5. Your site is now live at https://embroo-app.vercel.app
# To use your custom domain (embroo.in):
# Go to Vercel dashboard → Project → Settings → Domains → Add embroo.in
```

**Set environment variables in Vercel:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add each variable from `.env.example`

### Option B: Any Linux VPS (DigitalOcean, AWS, etc.)

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install git (if not installed)
sudo apt update && sudo apt install -y git

# 3. Clone your code
git clone <your-repo-url> /var/www/embroo-app
cd /var/www/embroo-app

# 4. Run the magic script
chmod +x install.sh
./install.sh --production

# This installs Node.js, npm, dependencies, builds the app,
# installs PM2 (process manager), and starts everything.

# 5. Set up Nginx (web server) as reverse proxy
sudo apt install -y nginx

# 6. Create Nginx config
sudo nano /etc/nginx/sites-available/embroo

# Paste this config:
# server {
#     listen 80;
#     server_name embroo.in www.embroo.in;
#
#     location / {
#         proxy_pass http://127.0.0.1:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

# 7. Enable the site
sudo ln -s /etc/nginx/sites-available/embroo /etc/nginx/sites-enabled/
sudo nginx -t       # Test config
sudo systemctl restart nginx

# 8. Set up SSL (HTTPS) with Let's Encrypt — FREE
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d embroo.in -d www.embroo.in
# Follow the prompts, enter your email, agree to terms
# Certbot auto-renews every 90 days

# 9. Point your domain DNS to the server IP
# Go to your domain registrar (GoDaddy, Namecheap, etc.)
# Add an A record: embroo.in → your-server-ip
# Add an A record: www.embroo.in → your-server-ip
# DNS takes 5-30 minutes to propagate
```

### After Deployment: Updating the Site

```bash
# On your server:
cd /var/www/embroo-app
git pull                  # Get latest code
npm install               # Install any new packages
npm run build             # Rebuild
pm2 restart embroo-app    # Restart the app
```

---

## DNS Setup for embroo.in

Wherever you registered `embroo.in`, add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | your-server-ip (or Vercel IP) | 300 |
| A | www | your-server-ip (or Vercel IP) | 300 |
| CNAME | www | embroo.in | 300 |

**If using Vercel:** Instead of A records, add:
| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |

---

## Useful Resources for Learning

| Topic | Resource |
|-------|----------|
| React basics | https://react.dev/learn |
| Next.js tutorial | https://nextjs.org/learn |
| Tailwind CSS | https://tailwindcss.com/docs |
| TypeScript | https://www.typescriptlang.org/docs/handbook/ |
| Git basics | https://learngitbranching.js.org |
| npm explained | https://docs.npmjs.com/about-npm |
| Three.js | https://threejs.org/docs |
| Vercel deployment | https://vercel.com/docs |

---

## Costs Breakdown (Monthly)

| Service | Free Tier | Paid |
|---------|----------|------|
| Vercel hosting | 100GB bandwidth | $20/mo Pro |
| PostgreSQL (Neon) | 512MB storage | $19/mo |
| Cloudinary (images) | 25K transforms | $89/mo |
| Razorpay | No monthly fee | 2% per transaction |
| Domain (embroo.in) | — | ~₹800/year |
| OpenAI API | $5 free credit | Pay per use (~$0.04/image) |
| Resend (email) | 100 emails/day | $20/mo |
| **Total to launch** | **~₹800/year (domain only)** | |

You can run this entire platform on **free tiers** until you get real traffic.

---

## FAQ

**Q: I changed a file but nothing happened on the page?**
A: If running `npm run dev`, changes auto-refresh. If running `npm start` (production), you need to `npm run build` again.

**Q: I see red errors in the terminal — is that bad?**
A: Warnings (yellow) are usually OK. Errors (red) need fixing. Read the error message — it usually says exactly what's wrong and which file.

**Q: How do I add a new page?**
A: Create a new folder in `src/app/` with a `page.tsx` file. The folder name becomes the URL. Example: `src/app/about/page.tsx` → accessible at `/about`.

**Q: How do I add a new component?**
A: Create a `.tsx` file in the appropriate `src/components/` subfolder. Import it where needed.

**Q: What's the difference between `npm run dev` and `npm run build && npm start`?**
A: `dev` = development mode (slow but auto-refreshes, shows detailed errors). `build + start` = production mode (fast, optimized, no source maps).

**Q: How do I check if my site is working from another device?**
A: Find your computer's IP (`ifconfig` on Mac, `ipconfig` on Windows). Open `http://YOUR_IP:3000` from the other device (must be on same WiFi).

**Q: The install.sh script fails — what do I do?**
A: Run each step manually from the README. The script just automates what's in "Manual Setup" section.
