# Embroidery Studio - Custom Embroidery Startup Website

## Project Overview
A premium custom embroidery startup website featuring an interactive 3D garment builder/visualizer. Users can design custom embroidery on hoodies, t-shirts, and other clothing items, place designs precisely, select sizes, and preview how they'll look wearing the garment with their face on it.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D Engine**: Three.js + React Three Fiber (for garment visualization)
- **State Management**: Zustand (for design builder state)
- **Animation**: Framer Motion
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **File Storage**: AWS S3 / Cloudinary (for user uploads)
- **Deployment**: Vercel

## Project Structure
```
src/
  app/              # Next.js App Router pages
  components/       # Reusable UI components
  components/builder/  # Garment builder components
  components/3d/    # Three.js 3D viewer components
  lib/              # Utility functions, API helpers
  stores/           # Zustand stores
  types/            # TypeScript type definitions
  hooks/            # Custom React hooks
public/
  models/           # 3D garment models (.glb/.gltf)
  textures/         # Fabric textures
  fonts/            # Embroidery fonts
prisma/             # Database schema
```

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Design Principles
- Mobile-first responsive design
- Premium, modern aesthetic (dark theme with accent colors)
- Smooth animations and transitions
- Accessibility (WCAG 2.1 AA)
- Performance-first (target Lighthouse 90+)
