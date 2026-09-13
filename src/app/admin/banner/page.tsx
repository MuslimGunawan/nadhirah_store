import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import BannerManager from "@/components/admin/BannerManager";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const banners = await prisma.banner.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
          Kelola Banner Hero Beranda
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Banner promo besar yang tampil di bagian paling atas halaman utama website.
        </p>
      </div>

      <BannerManager initialBanners={banners} />
    </div>
  );
}
