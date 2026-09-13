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
    const {
      storeName,
      logoUrl,
      tagline,
      whatsappNumber,
      waMessageTemplate,
      themeColor,
      instagram,
      tiktok,
      address,
      operationalHours,
    } = body;

    const socialLinks = JSON.stringify({
      instagram: instagram || "",
      tiktok: tiktok || "",
    });

    const updated = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: {
        storeName: storeName || "Nadhirah Store",
        logoUrl: logoUrl || null,
        tagline: tagline || "",
        whatsappNumber: whatsappNumber || "6281234567890",
        waMessageTemplate:
          waMessageTemplate ||
          `Halo Kak {store_name}, saya mau tanya/pesan produk ini:\n- Nama Produk: {product_name}\n- Varian: {variant}\n- Harga: {price}\n- Link: {product_url}\n\nApakah stok masih tersedia?`,
        themeColor: themeColor || "rose",
        socialLinks,
        address: address || "",
        operationalHours: operationalHours || "",
      },
      create: {
        id: 1,
        storeName: storeName || "Nadhirah Store",
        logoUrl: logoUrl || null,
        tagline: tagline || "",
        whatsappNumber: whatsappNumber || "6281234567890",
        waMessageTemplate: waMessageTemplate || "",
        themeColor: themeColor || "rose",
        socialLinks,
        address: address || "",
        operationalHours: operationalHours || "",
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui pengaturan toko" },
      { status: 500 }
    );
  }
}
