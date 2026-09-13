"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Menu, X, Search, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormattedSettings, cleanPhoneNumber } from "@/lib/store";

interface NavbarProps {
  settings: FormattedSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const phone = cleanPhoneNumber(settings.whatsappNumber);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Katalog Busana", href: "/produk" },
    { name: "Tentang Toko", href: "/tentang" },
    { name: "Kontak & Lokasi", href: "/kontak" },
    { name: "FAQ", href: "/faq" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-[var(--border)] bg-[#FDFBF7]/95 backdrop-blur-md shadow-xs py-1"
            : "border-b border-[var(--border)]/70 bg-[#FDFBF7]/85 backdrop-blur-sm py-2"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo / Brand Name */}
            <Link href="/" className="flex items-center gap-2 group">
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
                    className={`text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:text-[var(--accent)] relative py-1 ${
                      isActive
                        ? "text-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[var(--accent)]"
                        : "text-[var(--foreground)]/75"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Search Modal Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2.5 text-[var(--foreground)]/75 hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--muted-light)] cursor-pointer"
                aria-label="Cari produk"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Direct WhatsApp button */}
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={`https://wa.me/${phone}?text=${encodeURIComponent(
                  `Halo Kak ${settings.storeName}, saya ingin tanya informasi produk busana.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-2xs"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Chat WhatsApp</span>
              </motion.a>

              {/* Admin shortcut */}
              <Link
                href="/admin/login"
                className="p-2.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--muted-light)] hidden lg:inline-flex"
                title="Akses Dashboard Pengelola"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 text-[var(--foreground)] hover:text-[var(--accent)] focus:outline-hidden"
                aria-label="Buka menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-b border-[var(--border)] bg-[#FDFBF7] px-4 pt-2 pb-6 space-y-3 overflow-hidden"
            >
              <nav className="flex flex-col space-y-1 pt-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-[var(--accent-light)] text-[var(--accent)] font-semibold"
                        : "text-[var(--foreground)] hover:bg-[var(--muted-light)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(
                    `Halo Kak ${settings.storeName}, saya ingin bertanya mengenai koleksi busana.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-xs"
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
                  <span>Masuk Pengelola (Admin)</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Instant Search Dialog Modal */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif text-lg font-normal text-stone-900">
                  Cari Koleksi Busana
                </h3>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik nama busana, bahan (silk, katun, ceruty)..."
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 pl-12 pr-4 py-3.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                  <span>Pencarian populer: Abaya, Silk Scarf, Gamis Pleated</span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <span>Cari</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
