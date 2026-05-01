import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { verifyPayment } from "@/lib/razorpay";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_BODY_BYTES = 8 * 1024;

const SIGNATURE_RE = /^[a-f0-9]{64}$/i;
const PAYMENT_ID_RE = /^pay_[A-Za-z0-9]{6,40}$/;

// ---------------------------------------------------------------------------
// GET /api/orders/[id] — Get order details (owner or admin)
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id || id.length < 3) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, shippingAddress: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shippingCost: Number(order.shippingCost),
        total: Number(order.total),
        items: order.items.map((it) => ({ ...it, unitPrice: Number(it.unitPrice) })),
      },
    });
  } catch (err) {
    console.error("[Orders] GET error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/orders/[id] — Update an order
//
// Two flows are allowed:
//   1. Customer confirms a Razorpay payment by sending razorpayPaymentId +
//      razorpaySignature. The signature is verified server-side; on success
//      the order moves PENDING -> CONFIRMED and paymentStatus -> PAID.
//   2. Admins can update any field, including arbitrary status transitions.
// ---------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const { id } = await params;
    if (!id || id.length < 3) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner = order.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    const { razorpayPaymentId, razorpaySignature, status } = body as {
      razorpayPaymentId?: unknown;
      razorpaySignature?: unknown;
      status?: unknown;
    };

    // ── Customer flow: confirm a Razorpay payment ────────────────────────
    if (typeof razorpayPaymentId === "string" || typeof razorpaySignature === "string") {
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (
        typeof razorpayPaymentId !== "string" ||
        typeof razorpaySignature !== "string" ||
        !PAYMENT_ID_RE.test(razorpayPaymentId) ||
        !SIGNATURE_RE.test(razorpaySignature)
      ) {
        return NextResponse.json(
          { error: "Invalid payment confirmation payload" },
          { status: 400 },
        );
      }
      if (!order.paymentId) {
        return NextResponse.json(
          { error: "Order has no associated Razorpay order" },
          { status: 400 },
        );
      }

      const isValid = await verifyPayment(order.paymentId, razorpayPaymentId, razorpaySignature);
      if (!isValid) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }

      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          paymentId: razorpayPaymentId,
        },
      });
      return NextResponse.json({
        success: true,
        order: { id: updated.id, status: updated.status, paymentStatus: updated.paymentStatus },
      });
    }

    // ── Admin flow: arbitrary status transitions ─────────────────────────
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validStatuses = Object.values(OrderStatus) as string[];
    if (typeof status !== "string" || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 },
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json({
      success: true,
      order: { id: updated.id, status: updated.status, updatedAt: updated.updatedAt },
    });
  } catch (err) {
    console.error("[Orders] PATCH error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
