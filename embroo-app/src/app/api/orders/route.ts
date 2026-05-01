import { NextRequest, NextResponse } from "next/server";
import { Prisma, OrderStatus, PaymentStatus } from "@prisma/client";
import { orderSchema } from "@/lib/validation";
import { calculatePrice } from "@/lib/utils";
import { createRazorpayOrder } from "@/lib/razorpay";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_BODY_BYTES = 64 * 1024;

const garmentTypeMap = {
  hoodie: "HOODIE",
  tshirt: "TSHIRT",
  polo: "POLO",
  cap: "CAP",
} as const;

// ---------------------------------------------------------------------------
// POST /api/orders — Create a new order (authenticated user)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    // Compute totals server-side (never trust client-sent prices)
    let subtotal = 0;
    const verifiedItems = data.items.map((item) => {
      const pricing = calculatePrice(item.garmentType, item.zoneDesigns);
      const unitPrice = pricing.total;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      return { ...item, unitPrice, lineTotal };
    });

    const codFee = data.paymentMethod === "cod" ? 49 : 0;
    const total = subtotal + codFee;

    const orderNumber = `EMB-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    // Create Razorpay order first (don't persist if gateway fails)
    let razorpayOrderId: string | null = null;
    if (data.paymentMethod !== "cod") {
      try {
        const rp = await createRazorpayOrder(total, "INR", orderNumber);
        razorpayOrderId = rp.id;
      } catch (err) {
        console.error("[Orders] Razorpay order creation failed:", err);
        return NextResponse.json(
          { error: "Payment gateway error. Please try again." },
          { status: 502 },
        );
      }
    }

    // Persist address + order + items in one transaction
    const created = await prisma.$transaction(async (tx) => {
      const ship = data.shippingAddress;
      const address = await tx.address.create({
        data: {
          userId: user.id,
          fullName: ship.fullName,
          phone: ship.phone,
          line1: ship.addressLine1,
          line2: ship.addressLine2 ?? null,
          city: ship.city,
          state: ship.state,
          pinCode: ship.pinCode,
        },
      });

      const order = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          status: data.paymentMethod === "cod" ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
          subtotal: new Prisma.Decimal(subtotal),
          shippingCost: new Prisma.Decimal(codFee),
          total: new Prisma.Decimal(total),
          shippingAddressId: address.id,
          paymentId: razorpayOrderId,
          paymentStatus:
            data.paymentMethod === "cod" ? PaymentStatus.PENDING : PaymentStatus.PENDING,
          notes: data.notes ?? null,
          items: {
            create: verifiedItems.map((item) => ({
              garmentType: garmentTypeMap[item.garmentType],
              size: item.size,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              designSnapshot: {
                colors: item.colors,
                zoneDesigns: item.zoneDesigns,
              } as Prisma.InputJsonValue,
            })),
          },
        },
        include: { items: true },
      });

      return order;
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: created.id,
          orderNumber: created.orderNumber,
          totalAmount: Number(created.total),
          currency: "INR",
          status: created.status,
          razorpayOrderId,
          createdAt: created.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Orders] POST error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/orders — List orders for the authenticated user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));

    const where =
      user.role === "ADMIN" ? {} : { userId: user.id };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: true,
          shippingAddress: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        shippingCost: Number(o.shippingCost),
        total: Number(o.total),
        items: o.items.map((it) => ({ ...it, unitPrice: Number(it.unitPrice) })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[Orders] GET error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
