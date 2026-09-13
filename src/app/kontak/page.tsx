import { MessageCircle, MapPin, Clock } from "lucide-react";
import { getStoreSettings, cleanPhoneNumber } from "@/lib/store";
import Navbar from "@/components/Navbar";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak & Layanan",
  description: "Hubungi tim kami via WhatsApp resmi untuk konsultasi ukuran dan bantuan pemesanan.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const phone = cleanPhoneNumber(settings.whatsappNumber);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar settings={settings} />

      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-[#FAF8F5] py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Layanan Pelanggan
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[var(--foreground)] mt-2">
              Hubungi {settings.storeName}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted)] max-w-lg mx-auto">
              Kami siap melayani pertanyaan seputar stok busana, panduan ukuran, atau bantuan pemesanan langsung melalui WhatsApp.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-normal text-[var(--foreground)]">
                  WhatsApp Resmi
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Jalur tercepat untuk pemesanan, tanya ketersediaan stok, dan konfirmasi resi pengiriman.
                </p>
                <p className="text-sm font-semibold text-[var(--foreground)] pt-2">
                  +{phone}
                </p>
              </div>

              <a
                href={`https://wa.me/${phone}?text=${encodeURIComponent(
                  `Halo Kak ${settings.storeName}, saya ingin bertanya tentang produk Anda.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-3 text-xs font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                <span>Mulai Chat Sekarang</span>
              </a>
            </div>

            {/* Operational Hours Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8 space-y-4">
              <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-normal text-[var(--foreground)]">
                Jam Operasional
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Pesan WhatsApp di luar jam kerja tetap kami terima dan akan dibalas pada jam kerja berikutnya.
              </p>
              <div className="pt-2">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {settings.operationalHours || "Senin - Sabtu: 09.00 - 18.00 WIB"}
                </p>
                <p className="text-xs text-[var(--muted)] mt-1">Minggu & Hari Libur Nasional: Tutup</p>
              </div>
            </div>

            {/* Boutique Location / Socials */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8 space-y-4">
              <div className="h-10 w-10 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-normal text-[var(--foreground)]">
                Alamat & Butik
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {settings.address || "Jakarta Selatan, Indonesia"}
              </p>
              {settings.socialLinks?.instagram && (
                <div className="pt-2 border-t border-[var(--border)]">
                  <p className="text-xs font-semibold text-[var(--foreground)] mb-1">
                    Instagram:
                  </p>
                  <a
                    href={
                      settings.socialLinks.instagram.startsWith("http")
                        ? settings.socialLinks.instagram
                        : `https://instagram.com/${settings.socialLinks.instagram.replace("@", "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline"
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                    <span>{settings.socialLinks.instagram}</span>
                  </a>
                </div>
              )}
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
