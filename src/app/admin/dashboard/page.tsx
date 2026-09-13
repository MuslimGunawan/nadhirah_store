import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Clock,
  AlertTriangle,
  Layers,
  Plus,
  Settings,
  Download,
  ExternalLink,
  Edit,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getStoreSettings, formatPrice, cleanPhoneNumber } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getStoreSettings();
  const cleanPhone = cleanPhoneNumber(settings.whatsappNumber);

  const [
    totalActiveProducts,
    totalPreOrderProducts,
    totalSoldOutProducts,
    totalCategories,
    lowStockVariants,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { status: "active" } }),
    prisma.product.count({ where: { status: "pre_order" } }),
    prisma.product.count({ where: { status: "sold_out" } }),
    prisma.category.count(),
    prisma.productVariant.count({ where: { stock: { lte: 3 } } }),
    prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { orderIndex: "asc" }, take: 1 },
        variants: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header */}
      <div className="rounded-3xl border border-stone-200/90 bg-gradient-to-br from-white via-[#FAF8F5] to-amber-50/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200/80 text-[11px] font-semibold text-amber-900 tracking-wide">
              <Sparkles className="h-3 w-3 text-amber-700" />
              <span>Panel Kendali Etalase Butik</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900">
              Selamat Datang di {settings.storeName}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Seluruh etalase produk, foto, stok varian, dan jalur pemesanan WhatsApp dapat Anda pantau dan perbarui secara langsung dari sini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/admin/export"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300/80 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-all shadow-xs"
              title="Unduh seluruh database produk dalam format CSV / Excel"
            >
              <Download className="h-3.5 w-3.5 text-stone-500" />
              <span>Export CSV</span>
            </a>

            <Link
              href="/admin/produk/tambah"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4 text-amber-400" />
              <span>Tambah Produk Baru</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Ready Stock */}
        <div className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-3 hover:border-emerald-300 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Ready Stock
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-stone-900 font-serif">
              {totalActiveProducts}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Aktif di katalog publik</span>
            </p>
          </div>
        </div>

        {/* Card 2: Pre-Order */}
        <div className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-3 hover:border-amber-300 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Sistem Pre-Order
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-stone-900 font-serif">
              {totalPreOrderProducts}
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Estimasi jahit 7-10 hari
            </p>
          </div>
        </div>

        {/* Card 3: Stok Menipis / Habis */}
        <div className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-3 hover:border-rose-300 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Perlu Restok
            </span>
            <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-stone-900 font-serif">
              {lowStockVariants}
            </p>
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              {totalSoldOutProducts} produk bertanda habis
            </p>
          </div>
        </div>

        {/* Card 4: Kategori */}
        <div className="group rounded-2xl border border-stone-200 bg-white p-5 space-y-3 hover:border-stone-400 hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Kategori Aktif
            </span>
            <div className="h-8 w-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-stone-900 font-serif">
              {totalCategories}
            </p>
            <p className="text-[11px] text-stone-500 font-medium mt-1">
              Gamis, Hijab, Tunik, dll
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg font-normal text-stone-900">
          Akses Cepat Pengelolaan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/produk/tambah"
            className="group flex items-start gap-3.5 p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-900 hover:shadow-xs transition-all"
          >
            <div className="h-10 w-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-stone-900 group-hover:text-stone-900">
                Tambah Busana
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Upload foto, atur varian & harga baru
              </p>
            </div>
          </Link>

          <Link
            href="/admin/pengaturan-toko"
            className="group flex items-start gap-3.5 p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-600 hover:shadow-xs transition-all"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Settings className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-stone-900">
                Ganti Info Toko & WA
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Ubah nama, nomor WA & warna tema
              </p>
            </div>
          </Link>

          <Link
            href="/admin/banner"
            className="group flex items-start gap-3.5 p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-900 hover:shadow-xs transition-all"
          >
            <div className="h-10 w-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-stone-900">
                Kelola Banner Hero
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Ganti banner promosi di halaman depan
              </p>
            </div>
          </Link>

          <a
            href="/api/admin/export"
            className="group flex items-start gap-3.5 p-4 rounded-2xl border border-stone-200 bg-white hover:border-emerald-600 hover:shadow-xs transition-all"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Download className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-stone-900">
                Backup Data (CSV)
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Download file rekap seluruh produk
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* WhatsApp Live Channel Card */}
      <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/70 via-white to-stone-50 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="h-6 w-6 fill-current" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Jalur Closing WhatsApp: +{cleanPhone}
              </h3>
              <span className="h-2 w-2 rounded-full bg-[#25D366]"></span>
            </div>
            <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
              Setiap tombol &quot;Pesan via WhatsApp&quot; di halaman produk akan otomatis membuka obrolan ke nomor ini dengan format nama produk, varian, dan tautan halaman.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${cleanPhone}?text=Uji%20Coba%20Koneksi%20WhatsApp%20dari%20Dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            <span>Uji Coba Chat</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <Link
            href="/admin/pengaturan-toko"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
          >
            <span>Ubah Nomor</span>
          </Link>
        </div>
      </div>

      {/* Recent Products Showcase Table */}
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4.5 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]/60">
          <div>
            <h2 className="font-serif text-base font-normal text-stone-900">
              Koleksi Busana Terbaru
            </h2>
            <p className="text-[11px] text-stone-500">
              6 produk terakhir yang ditambahkan ke etalase
            </p>
          </div>
          <Link
            href="/admin/produk"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 hover:text-amber-700 transition-colors"
          >
            <span>Buka Semua Produk</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Foto & Nama Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Harga</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Varian & Stok</th>
                <th className="px-6 py-3.5 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentProducts.map((p) => {
                const img =
                  p.images[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

                const totalStock = p.variants.reduce(
                  (acc, v) => acc + v.stock,
                  0
                );

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-amber-50/20 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-9 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-2xs">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs space-y-0.5">
                          <p className="font-semibold text-stone-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-stone-400 font-mono">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium">
                        {p.category.name}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      {p.discountPrice ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-stone-900">
                            {formatPrice(p.discountPrice)}
                          </p>
                          <p className="text-[10px] text-stone-400 line-through">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                      ) : (
                        <span className="font-semibold text-stone-900">
                          {formatPrice(p.price)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.status === "active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : p.status === "pre_order"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : p.status === "sold_out"
                            ? "bg-stone-200 text-stone-700"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {p.status === "active"
                          ? "Ready Stock"
                          : p.status === "pre_order"
                          ? "Pre-Order"
                          : p.status === "sold_out"
                          ? "Habis"
                          : "Nonaktif"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-stone-600">
                      <p className="font-semibold text-stone-800">
                        {totalStock} pcs
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {p.variants.length} pilihan varian
                      </p>
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/produk/${p.slug}`}
                          target="_blank"
                          className="p-2 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                          title="Lihat halaman toko"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/admin/produk/${p.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:border-stone-800 hover:text-stone-900 transition-colors text-xs font-semibold"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
