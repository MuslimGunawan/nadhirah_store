import Link from "next/link";
import { MessageCircle, HelpCircle, ArrowRight } from "lucide-react";
import { getStoreSettings, cleanPhoneNumber } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panduan Belanja & FAQ",
  description: "Informasi cara pemesanan busana, pembayaran transfer manual, dan panduan ukuran.",
};

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const settings = await getStoreSettings();
  const phone = cleanPhoneNumber(settings.whatsappNumber);

  const faqs = [
    {
      q: "Bagaimana cara melakukan pemesanan di website ini?",
      a: "Pilih busana yang Anda sukai, tentukan varian (ukuran/warna), lalu klik tombol 'Pesan via WhatsApp'. Anda akan otomatis diarahkan ke chat WhatsApp resmi kami dengan rincian produk yang sudah terisi. Admin kami akan segera mengonfirmasi ketersediaan stok, total biaya termasuk ongkos kirim, dan nomor rekening resmi.",
    },
    {
      q: "Apakah website ini menerima pembayaran langsung via kartu kredit atau transfer otomatis?",
      a: "Demi keamanan dan kenyamanan komunikasi yang hangat, seluruh transaksi diproses secara personal melalui WhatsApp. Pembayaran dilakukan via transfer bank manual ke rekening resmi toko setelah Anda mendapatkan konfirmasi ketersediaan stok dan rincian ongkir dari admin kami.",
    },
    {
      q: "Berapa lama proses pengiriman barang?",
      a: "Untuk produk dengan status 'Ready Stock', pesanan yang dikonfirmasi sebelum jam 14.00 WIB akan dikirim pada hari yang sama atau maksimal H+1 hari kerja. Untuk produk bertanda 'Pre-Order', proses estimasi pembuatan adalah 7-10 hari kerja sebelum dikirimkan.",
    },
    {
      q: "Apakah bisa konsultasi panduan ukuran (size chart) sebelum memesan?",
      a: "Tentu saja! Admin kami siap membantu memberikan rekomendasi ukuran terbaik berdasarkan tinggi dan berat badan Anda. Silakan klik tombol 'Chat WhatsApp' untuk berkonsultasi langsung.",
    },
    {
      q: "Apakah produk yang salah ukuran bisa ditukar?",
      a: "Kami menerima penukaran ukuran maksimal 2x24 jam setelah barang diterima dengan syarat tag label produk masih terpasang rapi, belum dicuci, dan tidak ada noda. Ongkos kirim penukaran ditanggung oleh pembeli.",
    },
    {
      q: "Apakah foto produk di website adalah foto asli?",
      a: "Ya, 100% foto produk yang kami tampilkan merupakan hasil photoshoot asli dari koleksi Nadhirah Store dengan pencahayaan studio natural agar warna tampak mendekati aslinya (akurasi warna 95%).",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar settings={settings} />

      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-[#FAF8F5] py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Bantuan & Panduan
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[var(--foreground)] mt-2">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted)] max-w-lg mx-auto">
              Informasi lengkap seputar tata cara belanja, pengiriman, dan kebijakan toko kami.
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8 space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-[var(--border)] bg-white p-6 transition-all hover:border-[var(--accent-border)]"
            >
              <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-3 pl-8 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}

          {/* Help Box */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[#FAF8F5] p-8 text-center space-y-4">
            <h3 className="font-serif text-xl font-normal text-[var(--foreground)]">
              Masih memiliki pertanyaan lain?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md mx-auto">
              Tim admin kami siap menjawab segala keraguan Anda dengan senang hati.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${phone}?text=${encodeURIComponent(
                  `Halo Kak ${settings.storeName}, saya ingin bertanya perihal layanan belanja.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-xs font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                <span>Tanyakan di WhatsApp</span>
              </a>
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
