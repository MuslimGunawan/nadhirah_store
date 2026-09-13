import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const bannerId = parseInt(id);

  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, linkUrl, orderIndex, isActive } = body;

    const updated = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        title,
        subtitle,
        imageUrl,
        linkUrl,
        orderIndex: Number(orderIndex) || 0,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, banner: updated });
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json({ error: "Gagal memperbarui banner" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const bannerId = parseInt(id);

  try {
    await prisma.banner.delete({
      where: { id: bannerId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json({ error: "Gagal menghapus banner" }, { status: 500 });
  }
}
