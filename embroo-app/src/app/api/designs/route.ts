import { NextRequest, NextResponse } from 'next/server';

// GET /api/designs — List saved designs
export async function GET() {
  // TODO: Connect to Prisma when database is set up
  // const session = await getCurrentUser();
  // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // const designs = await prisma.design.findMany({ where: { userId: session.id } });

  return NextResponse.json({
    designs: [],
    message: 'Connect DATABASE_URL to enable saved designs',
  });
}

// POST /api/designs — Save a design
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    if (!body.garmentType || !body.colors) {
      return NextResponse.json(
        { error: 'Missing required fields: garmentType, colors' },
        { status: 400 }
      );
    }

    // TODO: Save to database when connected
    // const session = await getCurrentUser();
    // const design = await prisma.design.create({ data: { ...body, userId: session.id } });

    return NextResponse.json({
      success: true,
      id: crypto.randomUUID(),
      message: 'Design saved (in-memory). Connect DATABASE_URL for persistence.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
