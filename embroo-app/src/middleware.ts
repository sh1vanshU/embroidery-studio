import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // per window per IP

const ALLOWED_ORIGINS = [
  "https://embroo.in",
  "https://www.embroo.in",
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

// Patterns that indicate common attack vectors in URLs
const ATTACK_PATTERNS = [
  // SQL injection
  /(\bunion\b.*\bselect\b|;\s*drop\b|;\s*delete\b|;\s*insert\b|;\s*update\b|'\s*or\s+'1'\s*=\s*'1)/i,
  // Path traversal
  /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/|\.\.%2f|%252e%252e)/i,
  // Null bytes
  /(%00|\\x00)/i,
  // Script injection in URL
  /(<script|javascript:|vbscript:|data:text\/html)/i,
  // Common webshell / scanner paths
  /(\/wp-admin|\/wp-login|\/phpinfo|\/eval\(|\/shell\b)/i,
];

// ---------------------------------------------------------------------------
// In-memory rate-limit store (sliding window counters)
// In production, replace with Redis or a distributed store.
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent unbounded memory growth
let lastCleanup = Date.now();
function cleanupStore() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_WINDOW_MS) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function getRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  cleanupStore();
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt };
  }

  entry.count += 1;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  return {
    allowed: entry.count <= RATE_LIMIT_MAX_REQUESTS,
    remaining,
    resetAt: entry.resetAt,
  };
}

// ---------------------------------------------------------------------------
// Generate a cryptographic nonce for CSP
// ---------------------------------------------------------------------------

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  // Convert to base64 without importing Buffer (Edge Runtime compatible)
  return btoa(String.fromCharCode(...array));
}

// ---------------------------------------------------------------------------
// Generate a unique request ID for tracing / logging
// ---------------------------------------------------------------------------

function generateRequestId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // ------------------------------------------------------------------
  // 1. Redirect www -> non-www
  // ------------------------------------------------------------------
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    url.host = host.replace(/^www\./, "");
    return NextResponse.redirect(url, 301);
  }

  // ------------------------------------------------------------------
  // 2. Block common attack patterns
  // ------------------------------------------------------------------
  const fullPath = pathname + (url.search ?? "");
  for (const pattern of ATTACK_PATTERNS) {
    if (pattern.test(fullPath)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // ------------------------------------------------------------------
  // 3. Rate limiting
  // ------------------------------------------------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining, resetAt } = getRateLimit(ip);

  if (!allowed) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
      },
    });
  }

  // ------------------------------------------------------------------
  // 4. Build the response with injected headers
  // ------------------------------------------------------------------
  const response = NextResponse.next();

  // Rate-limit headers
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));

  // Request ID for logging / tracing
  const requestId = generateRequestId();
  response.headers.set("X-Request-Id", requestId);

  // CSP nonce — injected into the header so pages can use it
  const nonce = generateNonce();
  response.headers.set("X-CSP-Nonce", nonce);

  // Rewrite the CSP header with the actual nonce value
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

  // ------------------------------------------------------------------
  // 5. CORS headers for API routes
  // ------------------------------------------------------------------
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") ?? "";
    const isAllowed =
      ALLOWED_ORIGINS.includes(origin) ||
      process.env.NODE_ENV === "development";

    if (isAllowed) {
      response.headers.set("Access-Control-Allow-Origin", origin || "*");
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token, X-Request-Id"
    );
    response.headers.set("Access-Control-Max-Age", "86400");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // Preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
  }

  return response;
}

// ---------------------------------------------------------------------------
// Matcher — run middleware on all routes except static assets & _next internals
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|models/|textures/|fonts/).*)",
  ],
};
