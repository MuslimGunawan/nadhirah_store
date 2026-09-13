import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
      },
      orderBy: { id: "asc" },
    });

    // Generate CSV Rows
    const headers = [
      "ID",
      "Nama Produk",
      "Slug",
      "Kategori",
      "Harga Normal (Rp)",
      "Harga Diskon (Rp)",
      "Status",
      "Produk Unggulan",
      "Daftar Varian & Stok",
      "Jumlah Foto",
      "Tanggal Dibuat",
    ];

    const rows = products.map((p) => {
      const variantStr = p.variants
        .map((v) => `${v.variantName} (${v.stock} pcs)`)
        .join("; ");

      return [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.slug,
        `"${p.category.name.replace(/"/g, '""')}"`,
        p.price,
        p.discountPrice ?? "",
        p.status,
        p.isFeatured ? "Ya" : "Tidak",
        `"${variantStr.replace(/"/g, '""')}"`,
        p.images.length,
        p.createdAt.toISOString().split("T")[0],
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

    const dateStr = new Date().toISOString().split("T")[0];
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nadhirah-store-produk-${dateStr}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json({ error: "Gagal mengekspor data" }, { status: 500 });
  }
}
