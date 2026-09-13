import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
          Tambah Produk Busana Baru
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Masukkan detail busana, varian ukuran, dan foto untuk ditampilkan di katalog website.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
