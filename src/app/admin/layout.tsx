import { getSession } from "@/lib/auth";
import { getStoreSettings } from "@/lib/store";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ExternalLink, ShoppingBag, Store } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const settings = await getStoreSettings();

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col md:flex-row text-stone-900 font-sans">
      {session ? (
        <>
          <AdminSidebar
            storeName={settings.storeName}
            adminEmail={session.email}
          />
          <div className="flex-1 flex flex-col min-w-0">
            {/* Elegant Topbar */}
            <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-stone-200/90 bg-white/80 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {settings.storeName} — Mode Pengelola Aktif
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all hover:border-amber-600/40"
                >
                  <Store className="h-3.5 w-3.5 text-amber-700" />
                  <span>Lihat Etalase Toko</span>
                  <ExternalLink className="h-3 w-3 text-stone-400" />
                </Link>
              </div>
            </header>

            {/* Main Content Viewport */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
              {children}
            </main>
          </div>
        </>
      ) : (
        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>
      )}
    </div>
  );
}
