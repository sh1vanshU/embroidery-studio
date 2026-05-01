import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, GarmentType } from "@prisma/client";
import { designSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_DESIGNS_PER_USER = 200;

const garmentTypeMap: Record<z.infer<typeof designSchema>["garmentType"], GarmentType> = {
  hoodie: GarmentType.HOODIE,
  tshirt: GarmentType.TSHIRT,
  polo: GarmentType.POLO,
  cap: GarmentType.CAP,
};

const saveDesignSchema = designSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(80),
  thumbnailUrl: z.string().url().max(500).optional(),
});

// ---------------------------------------------------------------------------
// GET /api/designs — list saved designs for the authenticated user
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const designs = await prisma.design.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, designs });
  } catch (err) {
    console.error("[Designs] GET error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/designs — save a design
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await req.json().catch(() => null);
    const parsed = saveDesignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existingCount = await prisma.design.count({ where: { userId: user.id } });
    if (existingCount >= MAX_DESIGNS_PER_USER) {
      return NextResponse.json(
        { error: `Design limit reached (${MAX_DESIGNS_PER_USER}). Delete some designs first.` },
        { status: 409 },
      );
    }

    const design = await prisma.design.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        garmentType: garmentTypeMap[parsed.data.garmentType],
        colors: parsed.data.colors as Prisma.InputJsonValue,
        zoneDesigns: parsed.data.zoneDesigns as Prisma.InputJsonValue,
        thumbnailUrl: parsed.data.thumbnailUrl ?? null,
      },
    });

    return NextResponse.json({ success: true, design }, { status: 201 });
  } catch (err) {
    console.error("[Designs] POST error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
