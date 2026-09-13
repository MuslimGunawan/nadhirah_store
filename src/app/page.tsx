import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getStoreSettings();

  const [banners, categories, featuredProducts, latestProducts] =
    await Promise.all([
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: "asc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { isFeatured: true, status: { not: "inactive" } },
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { orderIndex: "asc" }, take: 1 },
        },
        take: 4,
      }),
      prisma.product.findMany({
        where: { status: { not: "inactive" } },
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { orderIndex: "asc" }, take: 1 },
        },
        take: 8,
      }),
    ]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar settings={settings} />

      {/* Hero Banner Section */}
      <HeroSlider banners={banners} />

      {/* Brand Value Propositions */}
      <section className="border-b border-[var(--border)] bg-[#FAF8F5]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[var(--accent)] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
                  Bahan Premium
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  Armani silk & voal berkualitas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[var(--accent)] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
                  Jahitan Butik
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  Presisi, rapi, dan nyaman dipakai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-[var(--accent)] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
                  Konsultasi Ramah
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  Bantu pilih ukuran via WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-[var(--accent)] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
                  Kirim Seluruh Nusantara
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  Ekspedisi terpercaya & cepat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Koleksi Spesial
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[var(--foreground)] mt-1">
                Kategori Busana
              </h2>
            </div>
            <Link
              href="/produk"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <span>Lihat semua produk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-[var(--border)] bg-stone-100"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-normal tracking-wide">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-300 group-hover:text-white transition-colors flex items-center gap-1 mt-0.5">
                    <span>Lihat katalog</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      {featuredProducts.length > 0 && (
        <section className="py-14 sm:py-18 bg-[#FAF8F5] border-y border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  Pilihan Eksklusif
                </p>
                <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[var(--foreground)] mt-1">
                  Koleksi Terfavorit
                </h2>
              </div>
              <Link
                href="/produk?featured=true"
                className="mt-2 sm:mt-0 text-xs sm:text-sm font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat pilihan lainnya</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Editorial Showcase / Story Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border)]">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
                alt="Filosofi Busana Nadhirah Store"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Filosofi Kami
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[var(--foreground)] leading-tight">
                Keanggunan yang Lahir dari Kesederhanaan
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[var(--muted)] leading-relaxed font-light">
                <p>
                  Di {settings.storeName}, kami percaya bahwa busana muslimah bukan sekadar penutup, melainkan cerminan rasa percaya diri dan kepribadian yang tenang. Setiap helai pakaian kami kurasikan dengan seksama, mengutamakan kenyamanan serat alami dan siluet santun yang tidak lekang oleh waktu.
                </p>
                <p>
                  Melalui pelayanan personal via WhatsApp, kami ingin memastikan setiap pertanyaan Anda perihal bahan, panduan ukuran, hingga padu-padan warna dijawab dengan penuh kehangatan.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] border-b border-[var(--foreground)] pb-1 transition-colors"
                >
                  <span>Baca cerita lengkap kami</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products Grid */}
      <section className="py-14 sm:py-18 bg-[#FAF8F5] border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Baru Rilis
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[var(--foreground)] mt-1">
                Koleksi Busana Terbaru
              </h2>
            </div>
            <Link
              href="/produk"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <span>Jelajahi seluruh katalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        storeName={settings.storeName}
      />
    </div>
  );
}
