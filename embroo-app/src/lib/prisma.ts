// Prisma client singleton
// Note: Run `npx prisma generate` after setting up your database
// and updating DATABASE_URL in .env.local

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClientClass: any;

try {
  // Dynamic import to prevent build failures when prisma isn't generated yet
  PrismaClientClass = require('@prisma/client').PrismaClient;
} catch {
  // Prisma client not generated yet — this is expected during initial setup
  PrismaClientClass = null;
}

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (PrismaClientClass
    ? new PrismaClientClass({
        log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      })
    : null);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
