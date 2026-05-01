import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

const MAX_BODY_BYTES = 1024;
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

// POST /api/newsletter — subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await req.json().catch(() => null);
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }
    const email = parsed.data.email.toLowerCase();

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      const ageMs = Date.now() - existing.subscribedAt.getTime();
      if (ageMs < COOLDOWN_MS) {
        // Idempotent success — don't leak whether email is already subscribed.
        return NextResponse.json({
          success: true,
          message: "Welcome to Embroo India! Check your inbox for 10% off.",
        });
      }
      await prisma.newsletter.update({
        where: { email },
        data: { isActive: true, subscribedAt: new Date() },
      });
    } else {
      await prisma.newsletter.create({ data: { email } });
    }

    // Optional: trigger a welcome email via Resend if configured.
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL ?? "Embroo India <hello@embroo.in>",
            to: [email],
            subject: "Welcome to Embroo India — your 10% off code inside",
            text: "Thanks for subscribing! Use WELCOME10 for 10% off your first order.",
          }),
        });
      } catch (err) {
        console.error("[Newsletter] Resend send failed:", err instanceof Error ? err.message : err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Welcome to Embroo India! Check your inbox for 10% off.",
    });
  } catch (err) {
    console.error("[Newsletter] error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
