import { NextRequest, NextResponse } from 'next/server';
import { orderSchema } from '@/lib/validation';
import { calculatePrice } from '@/lib/utils';
import { createRazorpayOrder } from '@/lib/razorpay';
import type { CartItem } from '@/types';

// ---------------------------------------------------------------------------
// POST /api/orders — Create a new order
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Calculate price server-side (never trust client-sent prices)
    let totalAmount = 0;
    const verifiedItems = data.items.map((item) => {
      const pricing = calculatePrice(
        item.garmentType,
        item.zoneDesigns
      );
      const verifiedUnitPrice = pricing.total;
      const lineTotal = verifiedUnitPrice * item.quantity;
      totalAmount += lineTotal;

      return {
        ...item,
        unitPrice: verifiedUnitPrice,
        lineTotal,
      };
    });

    // Generate order number
    const orderNumber = `EMB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Create Razorpay order (if not COD)
    let razorpayOrder = null;
    if (data.paymentMethod !== 'cod') {
      try {
        razorpayOrder = await createRazorpayOrder(
          totalAmount,
          'INR',
          orderNumber
        );
      } catch (err) {
        console.error('[Orders] Razorpay order creation failed:', err);
        return NextResponse.json(
          { error: 'Payment gateway error. Please try again.' },
          { status: 502 }
        );
      }
    }

    // Build order object
    // In production, save to database via Prisma here
    const order = {
      id: orderNumber,
      items: verifiedItems,
      shippingAddress: data.shippingAddress,
      billingAddress: data.sameAsShipping
        ? data.shippingAddress
        : data.billingAddress,
      paymentMethod: data.paymentMethod,
      couponCode: data.couponCode || null,
      notes: data.notes || null,
      totalAmount,
      currency: 'INR',
      status: data.paymentMethod === 'cod' ? 'confirmed' : 'awaiting_payment',
      razorpayOrderId: razorpayOrder?.id || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          totalAmount: order.totalAmount,
          currency: order.currency,
          status: order.status,
          razorpayOrderId: order.razorpayOrderId,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Orders] POST error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/orders — List orders for authenticated user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user from session
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 10));

    // TODO: Fetch from database
    // const orders = await prisma.order.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { createdAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    return NextResponse.json({
      success: true,
      orders: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    });
  } catch (err) {
    console.error('[Orders] GET error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
