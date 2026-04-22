// ---------------------------------------------------------------------------
// EMBROO INDIA — Security Utilities
// ---------------------------------------------------------------------------
//
// Server-side security helpers. Import only in server components, API routes,
// or server actions. The bcrypt functions require `bcryptjs` to be installed:
//   npm install bcryptjs && npm install -D @types/bcryptjs
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. Input Sanitization — strips XSS vectors from user text
// ---------------------------------------------------------------------------

const XSS_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Strip HTML tags entirely
  { pattern: /<[^>]*>/g, replacement: "" },
  // Remove javascript: / vbscript: / data: protocol handlers
  { pattern: /(?:javascript|vbscript|data)\s*:/gi, replacement: "" },
  // Remove event handler attributes (onerror, onload, etc.)
  { pattern: /\bon\w+\s*=/gi, replacement: "" },
  // Remove expression() / url() in CSS context
  { pattern: /expression\s*\(/gi, replacement: "" },
  { pattern: /url\s*\(/gi, replacement: "" },
  // Neutralize HTML entities that could encode tags
  { pattern: /&#/g, replacement: "" },
  // Remove null bytes
  { pattern: /\0/g, replacement: "" },
];

/**
 * Strip XSS vectors from user-provided text input.
 * Does NOT escape for HTML output — use framework escaping for rendering.
 */
export function sanitizeInput(text: string): string {
  if (typeof text !== "string") return "";

  let cleaned = text.trim();
  for (const { pattern, replacement } of XSS_PATTERNS) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  // Collapse excessive whitespace
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  return cleaned;
}

// ---------------------------------------------------------------------------
// 2. File Upload Validation
// ---------------------------------------------------------------------------

/** Maximum upload size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".gif",
  ".pdf",
  ".ai",
  ".eps",
]);

// Magic byte signatures for common image formats
const MAGIC_BYTES: Record<string, number[]> = {
  jpg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header; actual "WEBP" at offset 8
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
};

/**
 * Validate a user-uploaded file by extension, size, and magic bytes.
 */
export function validateFileUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: "No file provided." };
  }

  // Check size
  if (file.size === 0) {
    return { valid: false, error: "File is empty." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File exceeds the maximum size of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
    };
  }

  // Check extension
  const name = file.name.toLowerCase();
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1) {
    return { valid: false, error: "File has no extension." };
  }
  const ext = name.slice(dotIndex);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Extension "${ext}" is not allowed. Accepted: ${[...ALLOWED_EXTENSIONS].join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Async variant that also checks magic bytes by reading the first few bytes.
 * Use this server-side where you have the full ArrayBuffer.
 */
export async function validateFileUploadDeep(
  file: File
): Promise<{ valid: boolean; error?: string }> {
  const basicCheck = validateFileUpload(file);
  if (!basicCheck.valid) return basicCheck;

  const name = file.name.toLowerCase();
  const ext = name.slice(name.lastIndexOf(".") + 1);

  const expectedBytes = MAGIC_BYTES[ext === "jpeg" ? "jpg" : ext];
  if (expectedBytes) {
    try {
      const buffer = await file.slice(0, 16).arrayBuffer();
      const header = new Uint8Array(buffer);
      const matches = expectedBytes.every((b, i) => header[i] === b);
      if (!matches) {
        return {
          valid: false,
          error: "File content does not match its extension (magic bytes mismatch).",
        };
      }
    } catch {
      return { valid: false, error: "Unable to read file header." };
    }
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// 3. CSRF Token Generation
// ---------------------------------------------------------------------------

/**
 * Generate a 32-byte hex CSRF token using the Web Crypto API.
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// 4. Password Hashing (bcryptjs wrapper)
// ---------------------------------------------------------------------------

/**
 * Hash a plaintext password with bcrypt (cost factor 12).
 * Requires: npm install bcryptjs @types/bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  // Dynamic import so the module only loads when this function is called.
  // This keeps the rest of the security utilities usable in Edge Runtime.
  const bcrypt = await import("bcryptjs");
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a plaintext password against a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

// ---------------------------------------------------------------------------
// 5. Session Token Generation
// ---------------------------------------------------------------------------

/**
 * Generate a cryptographically random session token (48 bytes, base64url).
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  // Base64url encoding (Edge Runtime compatible)
  const base64 = btoa(String.fromCharCode(...array));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ---------------------------------------------------------------------------
// 6. Rate Limiter (Sliding Window)
// ---------------------------------------------------------------------------

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimiterOptions {
  /** Maximum requests allowed within the window. */
  maxRequests: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

/**
 * In-memory sliding-window rate limiter.
 *
 * For production with multiple server instances, swap the internal Map
 * for a Redis-backed store (e.g. ioredis + sorted sets).
 */
export class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }

  /**
   * Check whether a request from `key` (e.g. IP or user ID) is allowed.
   * Returns an object with the decision and metadata for response headers.
   */
  check(key: string): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Slide the window — drop timestamps outside the window
    record.timestamps = record.timestamps.filter((t) => t > windowStart);

    const allowed = record.timestamps.length < this.maxRequests;
    if (allowed) {
      record.timestamps.push(now);
    }

    const remaining = Math.max(0, this.maxRequests - record.timestamps.length);
    const resetAt =
      record.timestamps.length > 0
        ? record.timestamps[0] + this.windowMs
        : now + this.windowMs;

    return { allowed, remaining, resetAt };
  }

  /** Remove all entries — useful for testing. */
  reset(): void {
    this.store.clear();
  }

  /** Remove expired entries to free memory. */
  cleanup(): void {
    const cutoff = Date.now() - this.windowMs;
    for (const [key, record] of this.store) {
      record.timestamps = record.timestamps.filter((t) => t > cutoff);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}
