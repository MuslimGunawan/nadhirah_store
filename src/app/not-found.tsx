import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getStoreSettings } from "@/lib/store";

export default async function NotFound() {
  const settings = await getStoreSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7]">
      <Navbar settings={settings} />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md text-center space-y-6">
          <p className="font-serif text-7xl sm:text-8xl font-normal text-stone-300 tracking-widest">
            404
          </p>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-light">
              Koleksi atau tautan yang Anda tuju mungkin telah dipindahkan atau sudah tidak tersedia di etalase kami.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-xs font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>

            <Link
              href="/produk"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Lihat Katalog Produk</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
