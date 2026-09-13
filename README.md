# Nadhirah Store — Website Katalog & Etalase Busana Muslimah

Website etalase busana muslimah elegan dengan model transaksi **manual via WhatsApp**, dashboard admin mandiri berbahasa Indonesia, skema database siap reseller, dan desain anti-"AI slop" (*Playfair Display* + *Plus Jakarta Sans*).

---

## 🌟 Fitur Utama

### 🛍️ Sisi Pengunjung (Customer-Facing)
- **Beranda Butik**: Hero banner slider, bar keunggulan butik, showcase kategori (*Gamis & Abaya, Hijab & Scarf, Tunik & Blouse, One Set*), koleksi terfavorit (*Best Seller*), produk rilis terbaru, dan section filosofi toko.
- **Katalog & Filter Busana**: Pencarian nama/bahan real-time, filter kategori, filter status (*Semua, Ready Stock, Pre-Order, Diskon*), dan pengurutan harga.
- **Detail Produk & Checkout WhatsApp**: Galeri foto multi-sudut, pemilih varian ukuran/warna dengan indikator stok live, tombol **"Pesan via WhatsApp"** otomatis dengan pesan siap kirim, dan tombol **"Bagikan / Salin Link"**.
- **Halaman Statis**: Tentang Toko, Kontak & Lokasi, serta Panduan Belanja & FAQ.
- **Floating WhatsApp Button**: Obrolan cepat yang selalu mengambang di pojok kanan bawah.

### 🛡️ Sisi Pengelola (Dashboard Admin)
- **Autentikasi Sesi Aman**: Login pengelola berbasis JWT dan cookie HTTP-Only.
- **Ringkasan Toko (KPI)**: Metrik produk aktif, status pre-order, peringatan stok menipis (&le; 3 pcs), dan tombol **Export CSV**.
- **Pengaturan Profil Toko Fleksibel**: Pemilik toko dapat mengganti Nama Toko, Tagline, Nomor WhatsApp tujuan transaksi, Template Pesan Otomatis, dan 5 Pilihan Palet Warna Aksen Butik (*Rose Taupe, Terracotta, Sage Mist, Warm Gold, Noir Classic*) tanpa menyentuh kode.
- **Kelola Produk & Varian (CRUD)**: Tambah, edit, dan hapus produk lengkap dengan foto multi-sudut, toggle watermark opsional, serta builder varian ukuran/warna dan stok.
- **Kelola Kategori & Banner Hero**: Manajemen kategori busana dan banner promosi hero di beranda.
- **Arsitektur Siap Reseller**: Database telah menyertakan kolom `store_id` (default: 1) dan peran admin `role` (default: "owner") untuk kemudahan ekspansi ke sistem reseller/agen di masa depan.

---

## 🚀 Menjalankan di Lokal (Development)

1. **Clone repository & masuk ke direktori**:
   ```bash
   git clone https://github.com/MuslimGunawan/nadhirah_store.git
   cd nadhirah_store
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Inisialisasi basis data & seed data awal**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

5. **Login Dashboard Admin**:
   - URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - **Email**: `admin@nadhirah.com`
   - **Password**: `admin123`

---

## ☁️ Panduan Deploy ke Vercel

Proyek ini dibangun menggunakan **Next.js App Router** yang merupakan framework resmi dari Vercel, sehingga 100% didukung secara native.

### ⚠️ Catatan Penting Mengenai Basis Data di Vercel:
Karena Vercel beroperasi secara *serverless* (sistem file lokal bersifat *read-only* saat di-deploy), untuk menyimpan data produk baru atau perubahan profil toko secara permanen di cloud, Anda disarankan menggunakan database PostgreSQL gratis seperti:
- **[Supabase](https://supabase.com)** (PostgreSQL gratis)
- **[Neon](https://neon.tech)** (Serverless PostgreSQL gratis)
- **[Prisma Postgres](https://www.prisma.io/postgres)**

### Langkah-langkah Deploy:
1. Push kode ke GitHub (`MuslimGunawan/nadhirah_store`).
2. Buka dashboard [Vercel](https://vercel.com) dan klik **Add New Project** &rarr; **Import** repository `nadhirah_store`.
3. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL`: URL koneksi database PostgreSQL Anda (dari Supabase / Neon)
   - `ADMIN_JWT_SECRET`: Kunci rahasia acak untuk keamanan sesi login admin
   - `NEXT_PUBLIC_BASE_URL`: Domain Vercel Anda (misal: `https://nadhirah-store.vercel.app`)
4. Klik **Deploy**! Vercel akan otomatis meng-compile dan website Anda langsung online di seluruh dunia.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Boutique Custom Variables
- **Icons & Motion**: Lucide React + Framer Motion
- **ORM & Database**: Prisma ORM (SQLite lokal / PostgreSQL cloud)
- **Autentikasi**: Jose (JWT) + Bcryptjs
