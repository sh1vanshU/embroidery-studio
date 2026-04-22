import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/razorpay';

// ---------------------------------------------------------------------------
// GET /api/orders/[id] — Get order details
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.length < 3) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // TODO: Get authenticated user from session
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Fetch from database
    // const order = await prisma.order.findUnique({
    //   where: { id, userId: session.user.id },
    //   include: { items: true },
    // });
    //
    // if (!order) {
    //   return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    // }

    return NextResponse.json({
      success: true,
      order: {
        id,
        status: 'processing',
        message: 'Order details will be available once the database is connected.',
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

// ---------------------------------------------------------------------------
// PATCH /api/orders/[id] — Update order status (admin only)
// ---------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Verify admin role from session
    // const session = await getServerSession(authOptions);
    // if (!session?.user || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await request.json();
    const { status, razorpayPaymentId, razorpaySignature } = body;

    // Valid order statuses
    const validStatuses = [
      'awaiting_payment',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // If confirming payment, verify Razorpay signature
    if (status === 'confirmed' && razorpayPaymentId && razorpaySignature) {
      const isValid = await verifyPayment(id, razorpayPaymentId, razorpaySignature);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        );
      }
    }

    // TODO: Update in database
    // const updatedOrder = await prisma.order.update({
    //   where: { id },
    //   data: {
    //     status,
    //     ...(razorpayPaymentId && { razorpayPaymentId }),
    //     updatedAt: new Date(),
    //   },
    // });

    return NextResponse.json({
      success: true,
      order: {
        id,
        status: status || 'processing',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error(`[Orders] PATCH error:`, err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
