import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ProductListTable from "@/components/admin/ProductListTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { orderIndex: "asc" } },
      variants: { orderBy: { id: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
          Kelola Produk Busana
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Daftar seluruh pakaian, abaya, hijab, dan setelan yang ditampilkan di etalase toko.
        </p>
      </div>

      <ProductListTable initialProducts={products} />
    </div>
  );
}
