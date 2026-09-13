import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      images: { orderBy: { orderIndex: "asc" } },
      variants: { orderBy: { id: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);

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

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        categoryId: parseInt(categoryId),
        description: description || "",
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        isFeatured: Boolean(isFeatured),
        status: status || "active",
      },
    });

    // Replace images
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId } });
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId,
            imageUrl: images[i].imageUrl,
            isWatermarked: Boolean(images[i].isWatermarked),
            orderIndex: i,
          },
        });
      }
    }

    // Replace variants
    if (Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId } });
      for (const v of variants) {
        if (v.variantName?.trim()) {
          await prisma.productVariant.create({
            data: {
              productId,
              variantName: v.variantName.trim(),
              stock: parseInt(v.stock) || 0,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);

  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}
