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
      name,
      slug,
      categoryId,
      description,
      price,
      discountPrice,
      isFeatured,
      status,
      images,
      variants,
    } = body;

    if (!name || !categoryId || !price) {
      return NextResponse.json(
        { error: "Nama, kategori, dan harga wajib diisi" },
        { status: 400 }
      );
    }

    // Generate unique slug if not provided or collision
    let finalSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const existingSlug = await prisma.product.findUnique({
      where: { slug: finalSlug },
    });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        categoryId: parseInt(categoryId),
        description: description || "",
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        isFeatured: Boolean(isFeatured),
        status: status || "active",
        storeId: 1, // Ready for reseller / multi-store architecture
      },
    });

    // Create Images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: images[i].imageUrl,
            isWatermarked: Boolean(images[i].isWatermarked),
            orderIndex: i,
          },
        });
      }
    }

    // Create Variants
    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        if (v.variantName?.trim()) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              variantName: v.variantName.trim(),
              stock: parseInt(v.stock) || 0,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan produk baru" },
      { status: 500 }
    );
  }
}
