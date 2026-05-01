import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";

const MAX_BODY_BYTES = 8 * 1024;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// POST /api/help — submit a design help / support request
export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await req.json().catch(() => null);
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { name, email, phone, subject, message, orderNumber } = parsed.data;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const html = [
        `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)}${
          phone ? `, ${escapeHtml(phone)}` : ""
        })</p>`,
        orderNumber ? `<p><strong>Order:</strong> ${escapeHtml(orderNumber)}</p>` : "",
        `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>`,
        `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      ].join("");

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "Embroo India <hello@embroo.in>",
          to: [process.env.RESEND_TO_SUPPORT ?? "support@embroo.in"],
          reply_to: email,
          subject: `[Help] ${subject}`,
          html,
        }),
      });
      if (!res.ok) {
        console.error("[Help] Resend send failed:", res.status);
      }
    } else {
      console.warn("[Help] RESEND_API_KEY missing — request received but no email sent.");
    }

    return NextResponse.json({
      success: true,
      message: "Your request has been received. We'll get back to you within 24 hours.",
    });
  } catch (err) {
    console.error("[Help] error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
