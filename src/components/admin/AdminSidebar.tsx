"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

interface AdminSidebarProps {
  storeName: string;
  adminEmail: string;
}

export default function AdminSidebar({
  storeName,
  adminEmail,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const mainNav = [
    { name: "Ringkasan Toko", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kelola Produk", href: "/admin/produk", icon: Package },
    { name: "Kategori Busana", href: "/admin/kategori", icon: Layers },
    { name: "Banner Hero", href: "/admin/banner", icon: ImageIcon },
  ];

  const configNav = [
    { name: "Profil Toko & WA", href: "/admin/pengaturan-toko", icon: Settings },
  ];

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari dashboard admin?")) {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-[#141210] text-stone-200 px-4 py-3.5 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
            {storeName.charAt(0)}
          </div>
          <div>
            <span className="font-serif text-sm font-normal text-white block">
              {storeName}
            </span>
            <span className="text-[10px] text-amber-400/90 tracking-wider uppercase font-medium">
              Panel Pengelola
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800/80"
          aria-label="Toggle menu admin"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:flex flex-col w-full md:w-72 bg-[#141210] text-stone-300 shrink-0 border-r border-stone-800/80 min-h-screen justify-between`}
      >
        <div>
          {/* Boutique Brand Crest */}
          <div className="p-6 border-b border-stone-800/70">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600/90 to-amber-700 flex items-center justify-center text-white font-serif text-lg font-bold shadow-md ring-1 ring-amber-500/30">
                {storeName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-lg font-normal text-white truncate tracking-wide">
                  {storeName}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    Toko Aktif & Buka
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="px-4 py-6 space-y-6">
            {/* Group 1: Katalog & Penjualan */}
            <div>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Katalog & Konten
              </p>
              <nav className="space-y-1">
                {mainNav.map((item) => {
                  const isActive =
                    item.href === "/admin/dashboard"
                      ? pathname === "/admin/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-stone-800 to-stone-800/80 text-white shadow-xs border-l-3 border-amber-500 font-semibold"
                          : "text-stone-400 hover:text-white hover:bg-stone-850"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? "text-amber-400"
                              : "text-stone-400 group-hover:text-white"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Group 2: Pengaturan */}
            <div>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Konfigurasi Bisnis
              </p>
              <nav className="space-y-1">
                {configNav.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-stone-800 to-stone-800/80 text-white shadow-xs border-l-3 border-amber-500 font-semibold"
                          : "text-stone-400 hover:text-white hover:bg-stone-850"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? "text-amber-400"
                              : "text-stone-400 group-hover:text-white"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Public Store Live Preview Card */}
            <div className="px-1 pt-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3.5 rounded-xl bg-stone-900/90 border border-stone-800/90 hover:border-amber-600/40 transition-all hover:bg-stone-850"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-stone-200 group-hover:text-amber-400 transition-colors">
                    <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
                    <span>Lihat Etalase Publik</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-stone-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Buka website seperti yang dilihat oleh pembeli.
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* User Account & Logout Footer */}
        <div className="p-4 border-t border-stone-800/80 bg-[#0e0c0a]">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-bold text-stone-200">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {adminEmail}
                </p>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-950/60 text-amber-400 border border-amber-800/40">
                  Pemilik Toko
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{loggingOut ? "Sedang Keluar..." : "Keluar dari Dashboard"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
