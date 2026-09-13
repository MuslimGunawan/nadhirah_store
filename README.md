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

### 🎉 Proyek Supabase Sudah Dibuatkan & Di-Seed Otomatis:
Proyek Supabase resmi telah dibuatkan langsung melalui MCP di akun Anda:
- **Nama Proyek**: `nadhirah-store`
- **Project Ref**: `uplakqtxwrrhzpmxveii`
- **Region**: Singapore (`ap-southeast-1`)
- **API URL**: `https://uplakqtxwrrhzpmxveii.supabase.co`
- **Dashboard Supabase**: [https://supabase.com/dashboard/project/uplakqtxwrrhzpmxveii](https://supabase.com/dashboard/project/uplakqtxwrrhzpmxveii)
- **Status Tabel**: Seluruh 7 tabel (`StoreSettings`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `Admin`, `Banner`) telah dibuat dan data awal (katalog pakaian, admin `admin@nadhirah.com`) sudah otomatis di-seed ke dalamnya!

### Langkah Menghubungkan ke Vercel:
1. Buka [Pengaturan Database Supabase Anda](https://supabase.com/dashboard/project/uplakqtxwrrhzpmxveii/settings/database).
2. Jika belum mengatur password database, klik **Reset Database Password** dan buat password yang kuat.
3. Salin connection string **URI** (pilih mode *Transaction* atau *Session*), contoh:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
4. Di dashboard Vercel, tambahkan Environment Variables:
   - `DATABASE_URL`: Connection string Supabase Anda
   - `ADMIN_JWT_SECRET`: `nadhirah-store-super-secret-session-key-2026`
   - `NEXT_PUBLIC_BASE_URL`: `https://your-domain.vercel.app`
5. Jika ingin menggunakan PostgreSQL di Prisma untuk deploy Vercel, ubah baris `provider = "sqlite"` menjadi `provider = "postgresql"` di `prisma/schema.prisma`.
6. Klik **Deploy** di Vercel!

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Boutique Custom Variables
- **Icons & Motion**: Lucide React + Framer Motion
- **ORM & Database**: Prisma ORM (SQLite lokal / PostgreSQL cloud)
- **Autentikasi**: Jose (JWT) + Bcryptjs
