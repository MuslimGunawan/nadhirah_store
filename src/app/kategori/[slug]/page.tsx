import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ProductCard from "@/components/ProductCard";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const settings = await getStoreSettings();

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      status: { not: "inactive" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" }, take: 1 },
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar settings={settings} />

      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[#FAF8F5] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/produk"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke semua produk</span>
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Kategori Busana
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--foreground)] mt-1">
            {category.name}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--muted)]">
            Koleksi eksklusif {category.name.toLowerCase()} dengan material berkualitas dan jahitan rapi.
          </p>
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="mb-6 flex items-center justify-between text-xs text-[var(--muted)] border-b border-[var(--border)] pb-3">
          <p>
            Menampilkan <span className="font-semibold text-[var(--foreground)]">{products.length}</span> koleksi busana
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-12 text-center my-8">
            <h3 className="font-serif text-xl font-normal text-[var(--foreground)]">
              Koleksi kategori ini sedang dipersiapkan
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted)]">
              Kunjungi kembali dalam waktu dekat atau tanyakan ketersediaan melalui WhatsApp kami.
            </p>
            <div className="mt-6">
              <Link
                href="/produk"
                className="inline-flex rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
              >
                Lihat Koleksi Lain
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
