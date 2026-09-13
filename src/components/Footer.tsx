import Link from "next/link";
import { MessageCircle, MapPin, Clock, Heart } from "lucide-react";
import { FormattedSettings, cleanPhoneNumber } from "@/lib/store";

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

interface FooterProps {
  settings: FormattedSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = cleanPhoneNumber(settings.whatsappNumber);

  return (
    <footer className="border-t border-[var(--border)] bg-[#FAF8F5] text-[var(--foreground)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl tracking-wide text-[var(--foreground)]">
              {settings.storeName}
            </h3>
            <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed">
              {settings.tagline}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs text-[var(--muted)]">
              {settings.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.operationalHours && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>{settings.operationalHours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Menu Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-[var(--accent)] transition-colors">
                  Semua Koleksi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-[var(--accent)] transition-colors">
                  Tentang Toko
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-[var(--accent)] transition-colors">
                  Kontak & Lokasi
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--accent)] transition-colors">
                  Panduan Belanja & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hubungi Kami */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Layanan Pelanggan
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Pemesanan busana dilayani secara personal melalui WhatsApp resmi kami:
            </p>
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              <span>+{phone}</span>
            </a>

            {/* Social media links */}
            <div className="pt-2 flex items-center gap-3">
              {settings.socialLinks?.instagram && (
                <a
                  href={
                    settings.socialLinks.instagram.startsWith("http")
                      ? settings.socialLinks.instagram
                      : `https://instagram.com/${settings.socialLinks.instagram.replace("@", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted)] gap-3">
          <p>© {currentYear} {settings.storeName}. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1 text-[var(--muted)]">
            Dirancang dengan penuh dedikasi <Heart className="h-3 w-3 text-[var(--accent)] inline fill-[var(--accent)]" /> untuk fashion muslimah Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
