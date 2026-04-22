// ---------------------------------------------------------------------------
// EMBROO INDIA — Zod Validation Schemas
// ---------------------------------------------------------------------------
//
// Shared schemas used by both client (react-hook-form) and server (API routes).
// Import individual schemas as needed — tree-shaking friendly.
// ---------------------------------------------------------------------------

import { z } from "zod";

// ---------------------------------------------------------------------------
// Reusable Primitives
// ---------------------------------------------------------------------------

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(254, "Email is too long");

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

const phoneField = z
  .string()
  .trim()
  .regex(
    /^(\+91[\s-]?)?[6-9]\d{9}$/,
    "Enter a valid Indian phone number (e.g. +91 9876543210)"
  );

const nameField = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s'.,-]+$/, "Name contains invalid characters");

const pinCodeField = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code");

// ---------------------------------------------------------------------------
// 1. Login Schema
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required").max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// 2. Registration Schema
// ---------------------------------------------------------------------------

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
    phone: phoneField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// 3. Design Builder Schema (full builder state validation)
// ---------------------------------------------------------------------------

const garmentTypeSchema = z.enum(["hoodie", "tshirt", "polo", "cap"]);

const stitchTypeSchema = z.enum(["embroidery", "chenille"]);

const designTypeSchema = z.enum([
  "myPatches",
  "upload",
  "ai",
  "letters",
  "patch",
  "monoText",
  "patchText",
  "textPatch",
  "text2Lines",
]);

const zoneDesignSchema = z.object({
  type: designTypeSchema,
  text: z.string().max(50, "Text is too long").optional(),
  twoLineTexts: z
    .tuple([z.string().max(50), z.string().max(50)])
    .optional(),
  fontId: z.string().optional(),
  color: z.string().optional(),
  outline: z.string().optional(),
  stitchType: stitchTypeSchema,
  interlocked: z.boolean().optional(),
  patchId: z.string().optional(),
  uploadedFileUrl: z.string().url("Invalid upload URL").optional(),
  aiPrompt: z.string().max(500, "AI prompt is too long").optional(),
  aiResultUrl: z.string().url("Invalid AI result URL").optional(),
});

const garmentColorsSchema = z.object({
  body: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  hood: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  cuffs: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
});

export const designSchema = z.object({
  garmentType: garmentTypeSchema,
  colors: garmentColorsSchema,
  zoneDesigns: z.record(z.string(), zoneDesignSchema).refine(
    (zones) => Object.keys(zones).length <= 12,
    { message: "Maximum 12 design zones allowed" }
  ),
  size: z.enum(["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]),
  quantity: z.number().int().min(1, "Minimum quantity is 1").max(500, "Maximum quantity is 500"),
});

export type DesignInput = z.infer<typeof designSchema>;

// ---------------------------------------------------------------------------
// 4. Order Schema
// ---------------------------------------------------------------------------

const addressSchema = z.object({
  fullName: nameField,
  phone: phoneField,
  addressLine1: z
    .string()
    .trim()
    .min(5, "Address is too short")
    .max(200, "Address is too long"),
  addressLine2: z.string().trim().max(200).optional(),
  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100),
  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .max(100),
  pinCode: pinCodeField,
  landmark: z.string().trim().max(200).optional(),
});

const orderItemSchema = z.object({
  id: z.string().min(1),
  garmentType: garmentTypeSchema,
  colors: garmentColorsSchema,
  zoneDesigns: z.record(z.string(), zoneDesignSchema),
  size: z.string().min(1),
  quantity: z.number().int().min(1).max(500),
  unitPrice: z.number().min(0),
});

const paymentMethodSchema = z.enum([
  "upi",
  "card",
  "netbanking",
  "wallet",
  "cod",
]);

export const orderSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item")
    .max(50, "Maximum 50 items per order"),
  paymentMethod: paymentMethodSchema,
  couponCode: z
    .string()
    .trim()
    .max(30, "Coupon code is too long")
    .optional(),
  notes: z.string().trim().max(500, "Notes are too long").optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

// ---------------------------------------------------------------------------
// 5. Contact / Help Form Schema
// ---------------------------------------------------------------------------

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField.optional(),
  subject: z
    .string()
    .trim()
    .min(3, "Subject is too short")
    .max(150, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
  orderNumber: z.string().trim().max(50).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ---------------------------------------------------------------------------
// 6. Newsletter Schema
// ---------------------------------------------------------------------------

export const newsletterSchema = z.object({
  email: emailField,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// ---------------------------------------------------------------------------
// 7. Upload Metadata Schema
// ---------------------------------------------------------------------------

export const uploadSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(255, "File name is too long")
    .regex(
      /^[a-zA-Z0-9_\-. ]+$/,
      "File name contains invalid characters"
    ),
  fileSize: z
    .number()
    .int()
    .min(1, "File cannot be empty")
    .max(10 * 1024 * 1024, "File exceeds 10 MB limit"),
  mimeType: z
    .string()
    .regex(
      /^(image\/(jpeg|png|gif|webp|svg\+xml)|application\/pdf|application\/postscript)$/,
      "Unsupported file type"
    ),
  width: z.number().int().min(1).max(10000).optional(),
  height: z.number().int().min(1).max(10000).optional(),
});

export type UploadInput = z.infer<typeof uploadSchema>;
