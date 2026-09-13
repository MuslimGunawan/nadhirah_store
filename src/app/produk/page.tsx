import Link from "next/link";
import type { Metadata } from "next";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Katalog Busana",
  description: "Daftar lengkap koleksi busana muslimah, gamis, abaya, dan hijab elegan.",
};

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    status?: string;
    sort?: string;
    featured?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const categorySlug = params.kategori || "";
  const statusFilter = params.status || "";
  const sortBy = params.sort || "newest";
  const isFeaturedFilter = params.featured === "true";

  const settings = await getStoreSettings();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Build Prisma Query Filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: { not: "inactive" },
  };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (statusFilter === "pre_order") {
    where.status = "pre_order";
  } else if (statusFilter === "ready") {
    where.status = "active";
  } else if (statusFilter === "discount") {
    where.discountPrice = { not: null };
  }

  if (isFeaturedFilter) {
    where.isFeatured = true;
  }

  // Build Sorting Order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sortBy === "name_asc") {
    orderBy = { name: "asc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" }, take: 1 },
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar settings={settings} />

      {/* Catalog Banner & Header */}
      <div className="border-b border-[var(--border)] bg-[#FAF8F5] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Etalase Busana
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--foreground)] mt-1">
              Katalog Koleksi Pilihan
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted)]">
              Jelajahi beragam gamis, abaya, pashmina silk, dan setelan flowy dengan pemesanan langsung via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Filter & Search Bar */}
        <div className="mb-8 space-y-4">
          <form
            method="GET"
            action="/produk"
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
          >
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Cari busana, bahan, abaya..."
                className="w-full rounded-xl border border-[var(--border)] bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-hidden focus:border-[var(--accent)]"
              />
              {categorySlug && (
                <input type="hidden" name="kategori" value={categorySlug} />
              )}
              {statusFilter && (
                <input type="hidden" name="status" value={statusFilter} />
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <ArrowUpDown className="h-3.5 w-3.5 text-[var(--muted)]" />
              <select
                name="sort"
                defaultValue={sortBy}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs sm:text-sm text-[var(--foreground)] focus:outline-hidden focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga: Rendah ke Tinggi</option>
                <option value="price_desc">Harga: Tinggi ke Rendah</option>
                <option value="name_asc">Nama (A - Z)</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-[var(--foreground)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--accent)] transition-colors"
              >
                Terapkan
              </button>
            </div>
          </form>

          {/* Category Pills Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-[var(--muted)] font-medium shrink-0 flex items-center gap-1 pl-1">
              <SlidersHorizontal className="h-3 w-3" />
              <span>Kategori:</span>
            </span>

            <Link
              href={`/produk${q ? `?q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-all shrink-0 ${
                !categorySlug
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "bg-white border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]"
              }`}
            >
              Semua
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produk?kategori=${cat.slug}${
                  q ? `&q=${encodeURIComponent(q)}` : ""
                }`}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-all shrink-0 ${
                  categorySlug === cat.slug
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "bg-white border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]"
                }`}
              >
                {cat.name}
              </Link>
            ))}

            {/* Pre-Order Quick Filter */}
            <Link
              href={`/produk?status=pre_order${
                categorySlug ? `&kategori=${categorySlug}` : ""
              }`}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-all shrink-0 ${
                statusFilter === "pre_order"
                  ? "bg-amber-700 text-white shadow-xs"
                  : "bg-white border border-[var(--border)] text-[var(--foreground)] hover:border-amber-700"
              }`}
            >
              Pre-Order
            </Link>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between text-xs text-[var(--muted)] border-b border-[var(--border)] pb-3">
          <p>
            Menampilkan <span className="font-semibold text-[var(--foreground)]">{products.length}</span> koleksi busana
            {categorySlug && (
              <span> dalam kategori <strong className="text-[var(--foreground)]">{categories.find(c => c.slug === categorySlug)?.name}</strong></span>
            )}
            {q && (
              <span> untuk pencarian &quot;<strong className="text-[var(--foreground)]">{q}</strong>&quot;</span>
            )}
          </p>
          {(categorySlug || q || statusFilter || sortBy !== "newest") && (
            <Link
              href="/produk"
              className="text-[var(--accent)] hover:underline font-medium"
            >
              Reset Filter
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Custom High-Taste Empty State */
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-12 text-center my-8">
            <h3 className="font-serif text-xl font-normal text-[var(--foreground)]">
              Tidak ada busana yang ditemukan
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] max-w-sm mx-auto">
              Coba kata kunci lain atau pilih kategori yang berbeda untuk menemukan koleksi busana yang Anda cari.
            </p>
            <div className="mt-6">
              <Link
                href="/produk"
                className="inline-flex rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
              >
                Lihat Semua Koleksi
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer settings={settings} />
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        storeName={settings.storeName}
      />
    </div>
  );
}
