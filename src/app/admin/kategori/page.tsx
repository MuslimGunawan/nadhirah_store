import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
          Kelola Kategori Busana
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Atur pengelompokan busana (gamis, abaya, hijab, tunik) dan foto sampulnya.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
