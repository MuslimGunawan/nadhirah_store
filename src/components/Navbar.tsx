"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Menu, X, Search, ShieldCheck } from "lucide-react";
import { FormattedSettings, cleanPhoneNumber } from "@/lib/store";

interface NavbarProps {
  settings: FormattedSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const phone = cleanPhoneNumber(settings.whatsappNumber);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Katalog Produk", href: "/produk" },
    { name: "Tentang Toko", href: "/tentang" },
    { name: "Kontak", href: "/kontak" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[#FDFBF7]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              {settings.storeName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[var(--accent)] relative py-1 ${
                    isActive
                      ? "text-[var(--accent)] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[var(--accent)]"
                      : "text-[var(--foreground)]/80"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search link */}
            <Link
              href="/produk"
              className="p-2 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--muted-light)]"
              aria-label="Cari produk"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Direct WhatsApp button */}
            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent(
                `Halo Kak ${settings.storeName}, saya ingin tanya informasi produk.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-xs"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat WhatsApp</span>
            </a>

            {/* Admin shortcut */}
            <Link
              href="/admin/login"
              className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--muted-light)] hidden lg:inline-flex"
              title="Akses Dashboard Admin"
            >
              <ShieldCheck className="h-4 w-4" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--foreground)] hover:text-[var(--accent)] focus:outline-none"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[#FDFBF7] px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[var(--accent-light)] text-[var(--accent)] font-semibold"
                    : "text-[var(--foreground)] hover:bg-[var(--muted-light)]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent(
                `Halo Kak ${settings.storeName}, saya ingin bertanya mengenai koleksi busana.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-medium shadow-xs"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi via WhatsApp</span>
            </a>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Masuk Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
