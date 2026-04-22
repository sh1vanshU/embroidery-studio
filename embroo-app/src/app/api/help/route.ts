import { NextRequest, NextResponse } from 'next/server';

// POST /api/help — Submit design help request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // TODO: Send email notification via Resend
    // await resend.emails.send({
    //   from: 'Embroo India <help@embroo.in>',
    //   to: 'support@embroo.in',
    //   subject: `Design Help Request from ${name}`,
    //   html: `<p><strong>From:</strong> ${name} (${email}${phone ? `, ${phone}` : ''})</p><p>${message}</p>`,
    // });

    console.log('[Help Request]', { name, email, phone, message: message.slice(0, 100) });

    return NextResponse.json({
      success: true,
      message: 'Your request has been received. We\'ll get back to you within 24 hours.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
