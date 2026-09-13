import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const productId = parseInt(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: { orderBy: { orderIndex: "asc" } },
      variants: { orderBy: { id: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
          Edit Produk: {product.name}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Perbarui harga, stok varian, foto, atau status ketersediaan busana.
        </p>
      </div>

      <ProductForm
        categories={categories}
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          isFeatured: product.isFeatured,
          status: product.status,
          images: product.images.map((img) => ({
            imageUrl: img.imageUrl,
            isWatermarked: img.isWatermarked,
          })),
          variants: product.variants.map((v) => ({
            variantName: v.variantName,
            stock: v.stock,
          })),
        }}
      />
    </div>
  );
}
