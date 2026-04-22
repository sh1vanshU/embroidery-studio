import { NextRequest, NextResponse } from 'next/server';

// POST /api/newsletter — Subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // TODO: Save to database + send to email provider (Resend)
    // await prisma.newsletter.upsert({
    //   where: { email },
    //   create: { email },
    //   update: { isActive: true },
    // });

    return NextResponse.json({
      success: true,
      message: 'Welcome to Embroo India! Check your inbox for 10% off.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
