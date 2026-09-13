import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStoreSettings, formatPrice } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ProductGallery from "@/components/ProductGallery";
import ProductDetailAction from "@/components/ProductDetailAction";
import ProductCard from "@/components/ProductCard";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { take: 1 } },
  });
  const settings = await getStoreSettings();

  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — ${settings.storeName}`,
      description: product.description.slice(0, 160),
      images: product.images[0]?.imageUrl ? [product.images[0].imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const settings = await getStoreSettings();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { orderIndex: "asc" } },
      variants: { orderBy: { id: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: { not: "inactive" },
    },
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" }, take: 1 },
    },
  });

  const hasDiscount =
    product.discountPrice !== null && product.discountPrice < product.price;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar settings={settings} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-[var(--foreground)] transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <Link
            href={`/kategori/${product.category.slug}`}
            className="hover:text-[var(--foreground)] transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium truncate max-w-[180px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Product Media Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery
              images={product.images}
              productName={product.name}
              storeName={settings.storeName}
            />
          </div>

          {/* Right: Product Buy Box & Details */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/kategori/${product.category.slug}`}
                  className="rounded-full bg-[var(--muted-light)] px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                >
                  {product.category.name}
                </Link>

                {product.status === "pre_order" && (
                  <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 text-[11px] font-medium">
                    Sistem Pre-Order
                  </span>
                )}

                {product.status === "sold_out" && (
                  <span className="rounded-full bg-stone-200 text-stone-700 px-3 py-1 text-[11px] font-medium">
                    Stok Habis
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-4xl font-normal text-[var(--foreground)] leading-snug">
                {product.name}
              </h1>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 py-1">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-semibold text-[var(--accent)]">
                      {formatPrice(product.discountPrice!)}
                    </span>
                    <span className="text-sm sm:text-base text-[var(--muted)] line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="rounded-md bg-rose-100 text-rose-800 px-2 py-0.5 text-xs font-medium">
                      Hemat {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-[var(--border)]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-2">
                  Deskripsi & Bahan
                </h3>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/80 leading-relaxed whitespace-pre-line font-light">
                  {product.description}
                </p>
              </div>

              {/* Variant Selector + WhatsApp Closing Action */}
              <ProductDetailAction
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  discountPrice: product.discountPrice,
                  status: product.status,
                  variants: product.variants,
                }}
                settings={{
                  storeName: settings.storeName,
                  whatsappNumber: settings.whatsappNumber,
                  waMessageTemplate: settings.waMessageTemplate,
                }}
              />
            </div>

            {/* Quality & Service Guarantees */}
            <div className="mt-8 rounded-xl border border-[var(--border)] bg-[#FAF8F5] p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--foreground)]">
                  <strong>Foto Produk Asli & Eksklusif:</strong> Warna produk 95% akurat sesuai pencahayaan alami studio.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--foreground)]">
                  <strong>Pemeriksaan Jahitan Teliti:</strong> Setiap busana lolos quality control sebelum dikirimkan.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--foreground)]">
                  <strong>Pengemasan Bersih & Rapi:</strong> Dilapisi pouch pelindung anti basah.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  Rekomendasi
                </p>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[var(--foreground)]">
                  Koleksi Terkait
                </h2>
              </div>
              <Link
                href={`/kategori/${product.category.slug}`}
                className="text-xs font-medium text-[var(--accent)] hover:underline"
              >
                Lihat kategori {product.category.name}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
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
