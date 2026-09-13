import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, linkUrl, orderIndex, isActive } = body;

    if (!imageUrl?.trim()) {
      return NextResponse.json(
        { error: "Foto banner wajib diunggah atau diisi" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title: title || "",
        subtitle: subtitle || "",
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl || "/produk",
        orderIndex: Number(orderIndex) || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan banner" },
      { status: 500 }
    );
  }
}
