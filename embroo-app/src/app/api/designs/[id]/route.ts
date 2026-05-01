import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/designs/[id] — remove a saved design (owner only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id || id.length < 3) {
      return NextResponse.json({ error: "Invalid design ID" }, { status: 400 });
    }

    const design = await prisma.design.findUnique({ where: { id } });
    if (!design) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (design.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.design.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Designs] DELETE error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
