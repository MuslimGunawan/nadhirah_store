import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, ShieldCheck } from "lucide-react";
import { getStoreSettings } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Toko",
  description: "Cerita dedikasi dan komitmen kami menghadirkan busana muslimah elegan dan bersahaja.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getStoreSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar settings={settings} />

      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-[#FAF8F5] py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Kisah & Dedikasi Kami
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[var(--foreground)] mt-2">
              Tentang {settings.storeName}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
              Membangun ruang bersahaja bagi para muslimah untuk menemukan busana yang anggun, santun, dan nyaman dipakai dalam setiap momen kehidupan.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border)]">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
                alt="Tentang Nadhirah Store"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[var(--foreground)]">
                Lahir dari Cinta pada Detail & Kesantunan
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-light">
                {settings.storeName} didirikan dengan sebuah niat sederhana: menyediakan pakaian muslimah berkualitas butik tanpa kompromi pada kenyamanan dan kaidah syariat.
              </p>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-light">
                Banyak busana modern yang mengorbankan kenyamanan bahan demi tren sesaat. Kami memilih jalan berbeda—menggunakan serat alami pilihan, potongan leluasa yang tidak menampakkan lekuk tubuh, dan jahitan tepi halus yang rapi.
              </p>
              <div className="pt-2">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[var(--accent)] transition-colors"
                >
                  <span>Lihat Seluruh Koleksi</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="border-t border-[var(--border)] pt-12">
            <div className="text-center max-w-md mx-auto mb-10">
              <h3 className="font-serif text-2xl font-normal text-[var(--foreground)]">
                Prinsip Kualitas Kami
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Tiga pilar yang selalu kami jaga dalam setiap helai pakaian
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-[var(--border)] bg-white p-6 space-y-2.5">
                <Sparkles className="h-5 w-5 text-[var(--accent)]" />
                <h4 className="font-serif text-base font-normal text-[var(--foreground)]">
                  Bahan Terkurasi
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Kami menguji setiap kain untuk memastikan tidak menerawang, jatuh lembut, dan tetap sejuk di iklim tropis.
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-white p-6 space-y-2.5">
                <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
                <h4 className="font-serif text-base font-normal text-[var(--foreground)]">
                  Jahitan Presisi
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Dikerjakan oleh penjahit berpengalaman dengan kerapatan tusuk jarum standar butik, bukan konveksi massal cepat rusak.
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-white p-6 space-y-2.5">
                <Heart className="h-5 w-5 text-[var(--accent)]" />
                <h4 className="font-serif text-base font-normal text-[var(--foreground)]">
                  Pelayanan Personal
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Kami melayani konsultasi ukuran dan rekomendasi padu padan secara ramah langsung melalui obrolan WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        storeName={settings.storeName}
      />
    </div>
  );
}
