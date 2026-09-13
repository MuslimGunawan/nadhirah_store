# PRD & Blueprint — Nadhirah Store
### Product Requirements Document untuk Website Toko Baju (Dikerjakan oleh AI Agent — Antigravity)

**Versi:** 1.2 (Final)
**Tanggal:** 13 September 2026
**Status:** Final — siap dieksekusi oleh AI Agent (Antigravity)
**Pemilik Produk:** Kakak pemilik toko (bisnis owner)
**Disiapkan oleh:** Adik / project owner

**Riwayat Perubahan:**
- v1.0 — Draft awal: struktur fitur, admin dashboard, tech stack, analisis reseller.
- v1.1 — Tambah panduan anti-"AI slop" (Bagian 15) & referensi sumber skill untuk agent (Bagian 16).
- v1.2 — Finalisasi: perbaikan referensi silang antar bagian, tambah fitur share/copy link produk, status "Pre-Order", watermark foto opsional, dan export/backup data produk.

---

## 1. Ringkasan Eksekutif (Executive Summary)

Nadhirah Store adalah website katalog & etalase produk pakaian (fashion) dengan model transaksi **manual via WhatsApp** — bukan checkout online dengan payment gateway. Website berfungsi sebagai "etalase digital" yang elegan dan interaktif, di mana pengunjung bisa:

1. Melihat katalog produk dengan tampilan menarik.
2. Melihat detail produk (foto, varian, harga, deskripsi).
3. Klik tombol **"Pesan via WhatsApp"** yang otomatis membuka chat WA dengan pesan template berisi detail produk yang dipilih.

Pemilik toko mengelola semua konten (nama toko, produk, kategori, banner, nomor WA) melalui **dashboard admin** tanpa perlu sentuh kode.

Ke depan, ada rencana membuka sistem **reseller/agen**, namun ini **TIDAK dikerjakan di fase awal** — hanya disiapkan fondasinya agar tidak perlu bongkar ulang sistem nanti (detail di Bagian 9).

---

## 2. Tujuan Produk (Goals)

| # | Tujuan | Ukuran Keberhasilan |
|---|--------|----------------------|
| 1 | Toko online yang terlihat profesional & elegan | UI rapi, tidak terasa "template murahan" |
| 2 | Mudah dikelola non-teknis (kakak sebagai admin) | Semua perubahan konten via dashboard, tanpa kode |
| 3 | Mempermudah closing transaksi | Chat WA terisi otomatis (produk, varian, harga) saat klik "Pesan" |
| 4 | Nama & branding toko fleksibel | Nama toko, logo, warna, kontak = **data**, bukan hardcode di kode |
| 5 | Siap berkembang jadi sistem reseller | Struktur data & arsitektur tidak menutup opsi ekspansi |

### Yang BUKAN Tujuan (Out of Scope) di fase awal
- Tidak ada payment gateway / pembayaran online otomatis.
- Tidak ada sistem keranjang multi-checkout kompleks (opsional, lihat Fase 2).
- Tidak ada sistem reseller/agen aktif (baru disiapkan fondasinya saja).
- Tidak ada aplikasi mobile native (cukup web responsive).

---

## 3. Target Pengguna

### 3.1 Pengunjung / Calon Pembeli (Customer)
- Mayoritas akses dari **mobile** (asumsi traffic dari Instagram/WhatsApp/TikTok).
- Ingin browsing cepat, lihat foto jelas, langsung tanya/pesan tanpa ribet daftar akun.

### 3.2 Admin / Pemilik Toko (Kakak)
- Non-teknis, butuh dashboard yang **sangat sederhana dan intuitif**.
- Aktivitas utama: tambah/edit produk, ganti foto, ubah harga & stok, ganti info toko.

### 3.3 (Masa Depan) Reseller/Agent
- Belum aktif di fase ini. Lihat Bagian 9.

---

## 4. Lingkup Proyek (Scope) & Fase Pengerjaan

### **FASE 1 — MVP (Wajib, dikerjakan sekarang)**
- Landing page + katalog produk + detail produk + "Pesan via WA".
- Dashboard admin: kelola profil toko, produk, kategori, banner.
- Desain elegan, interaktif, mobile-first.

### **FASE 2 — Enhancement (opsional, setelah MVP jalan)**
- Wishlist / simpan favorit (local storage, tanpa akun).
- Multi-produk dalam satu pesan WA (mini keranjang sebelum checkout ke WA).
- Filter & pencarian produk lebih canggih (harga, ukuran, warna, kategori).
- Testimoni / ulasan pembeli.
- Analitik sederhana (produk paling banyak diklik "Pesan").

### **FASE 3 — Reseller/Agent System (masa depan, tidak dikerjakan sekarang)**
- Lihat Bagian 9 untuk analisis & rekomendasi arsitektur.

---

## 5. Fitur Sisi Pengunjung (Customer-Facing)

### 5.1 Homepage
- Hero section: banner utama (gambar/slider), nama toko, tagline (dari dashboard).
- Section "Produk Terbaru" / "Best Seller" (bisa ditandai admin sebagai "featured").
- Section kategori (grid kategori dengan gambar, klik → filter katalog).
- Section "Tentang Toko" singkat (opsional, dari dashboard).
- Footer: kontak, sosial media, jam operasional (semua dari dashboard).

### 5.2 Halaman Katalog Produk
- Grid produk (foto, nama, harga, badge "Baru"/"Diskon"/"Pre-Order"/"Habis" jika stok 0).
- Filter: kategori, rentang harga, ukuran.
- Sortir: terbaru, harga termurah/termahal, terlaris (jika fase 2).
- Search bar produk.
- Pagination atau infinite scroll (rekomendasi: infinite scroll agar terasa modern).

### 5.3 Halaman Detail Produk
- Galeri foto produk (multiple gambar, bisa zoom, swipe di mobile).
- Nama produk, harga (dengan harga coret jika ada diskon), deskripsi.
- Pilihan varian (ukuran/warna) jika ada — **wajib dipilih sebelum bisa pesan**.
- Info stok (tersedia / terbatas / pre-order / habis).
- Tombol utama **"Pesan via WhatsApp"** — generate pesan otomatis berisi:
  ```
  Halo Kak Nadhirah, saya mau tanya/pesan produk ini:
  - Nama Produk: [Nama Produk]
  - Varian: [Ukuran/Warna]
  - Harga: [Harga]
  - Link: [URL produk]
  ```
- Produk terkait / rekomendasi serupa di bagian bawah.
- Tombol **"Salin Link Produk"** / share ke sosial media — memudahkan share produk ke story IG, status WA, atau grup, tanpa perlu copy URL manual dari address bar.

### 5.4 Halaman Statis
- Tentang Toko.
- Kontak (nomor WA, alamat jika ada, jam operasional, embed lokasi opsional).
- FAQ (opsional): cara pesan, metode pembayaran, kebijakan retur, dll.

### 5.5 Navigasi & UX
- Sticky navbar dengan search icon + akses cepat ke WA.
- Floating button "Chat WA" selalu terlihat (mengambang di pojok layar).
- Smooth scroll & transisi halaman yang halus (lihat Bagian 7: Desain).
- Skeleton loading saat data produk dimuat (bukan spinner polos).

---

## 6. Fitur Sisi Admin (Dashboard)

Dashboard harus **super sederhana**, gunakan bahasa Indonesia yang jelas, minim istilah teknis.

### 6.1 Autentikasi
- Login admin (email/username + password).
- Lupa password → reset via email.
- (Opsional Fase 2) Multi-admin/staff dengan role terbatas.

### 6.2 Pengaturan Profil Toko *(inti dari permintaan "nama toko bisa diganti")*
Semua field ini disimpan sebagai **data**, bukan teks tertanam di kode:
- Nama toko
- Logo toko (upload gambar)
- Tagline / deskripsi singkat
- Nomor WhatsApp tujuan transaksi
- Template pesan WA (admin bisa custom formatnya)
- Warna tema (opsional, pilih dari beberapa preset palet warna elegan)
- Link sosial media (Instagram, TikTok, dll)
- Alamat & jam operasional (opsional)

### 6.3 Kelola Produk (CRUD)
- Tambah / edit / hapus produk.
- Upload multi-foto per produk (dengan reorder/drag).
- Field: nama, kategori, harga, harga diskon, deskripsi, varian (ukuran/warna + stok per varian), status (**aktif / nonaktif / pre-order / habis**).
- Tandai produk sebagai "Featured" / "Best Seller" agar tampil di homepage.
- (Opsional) Toggle **watermark otomatis** pada foto produk yang diupload — supaya foto tidak gampang dicomot/dipakai ulang oleh pihak lain tanpa izin.

### 6.4 Kelola Kategori
- Tambah/edit/hapus kategori (nama + gambar ikon/cover).

### 6.5 Kelola Banner/Promo
- Upload banner untuk hero section homepage (bisa lebih dari satu, jadi slider).

### 6.6 Dashboard Ringkasan (Fase 2, opsional tapi bagus untuk MVP juga)
- Statistik ringan: jumlah produk aktif, produk paling banyak diklik "Pesan via WA", produk stok menipis.

### 6.7 Backup & Export Data
- Tombol **"Export Data Produk"** (ke format CSV/Excel) dari dashboard admin — jaga-jaga kalau suatu hari perlu pindah sistem atau sekadar untuk arsip pribadi kakak.
- Rekomendasi ke agent: pastikan database di-backup otomatis oleh layanan hosting/database yang dipakai (misal Supabase punya fitur backup otomatis) — tidak perlu dibangun manual, cukup dipastikan aktif.

---

## 7. Desain & UI/UX Guidelines

> Requirement dari owner: **elegan, interaktif, UI keren, tetap intuitive.**

### 7.1 Arah Visual (Direction)
- Gaya: **minimalis elegan, fashion-forward** — banyak whitespace, foto produk jadi fokus utama (bukan elemen dekoratif berlebihan).
- Tipografi: kombinasi serif elegan untuk judul/heading (misal untuk kesan butik premium) + sans-serif bersih untuk body text.
- Palet warna: netral hangat (krem, putih gading, cokelat muda, hitam soft) dengan satu warna aksen (bisa disesuaikan brand kakak — misalnya dusty rose, maroon, atau emas muda). Warna aksen ini idealnya **dikontrol dari dashboard** (preset tema), bukan hardcode.
- Foto produk harus tampil besar, rasio konsisten, dengan efek hover halus (zoom-in tipis, transisi bayangan).

### 7.2 Interaksi & Micro-animations
- Transisi antar halaman: fade/slide halus, bukan pindah halaman kasar.
- Hover state pada kartu produk: sedikit elevasi (shadow) + zoom gambar halus.
- Skeleton loading, bukan spinner biasa, untuk kesan premium saat data dimuat.
- Scroll-triggered animation (elemen muncul fade-up saat discroll) — dipakai secukupnya, jangan berlebihan agar tetap terasa "clean".
- Tombol "Pesan via WhatsApp" harus punya micro-interaction (misal sedikit bounce/scale saat hover/tap) karena ini adalah **Call-to-Action utama** di seluruh web.

### 7.3 Prinsip Tetap Intuitive
- Maksimal 2 klik dari homepage ke halaman detail produk.
- Navigasi jelas, label tombol jangan ambigu (gunakan "Pesan via WhatsApp", bukan sekadar "Beli").
- Desain harus tetap **cepat diakses** — animasi jangan sampai bikin loading terasa lambat (gunakan animasi ringan berbasis CSS/Framer Motion, hindari animasi berat yang menunda interaksi).

### 7.4 Responsiveness
- Mobile-first (asumsi >70% traffic dari mobile karena datang dari sosial media).
- Desktop tetap dioptimalkan untuk pengalaman browsing yang lebih luas (grid produk lebih banyak kolom).

---

## 8. Rekomendasi Tech Stack

> Catatan untuk AI Agent (Antigravity): stack ini rekomendasi, sesuaikan dengan tooling yang tersedia di environment Antigravity, tapi pertahankan prinsip di baliknya (component-based, mudah maintain, mendukung animasi halus, dan admin dashboard terpisah dari CMS hardcode).

| Layer | Rekomendasi | Alasan |
|-------|-------------|--------|
| Frontend Framework | **Next.js (App Router) + TypeScript** | SEO-friendly (penting untuk toko online), performa bagus, mendukung image optimization |
| Styling | **Tailwind CSS** + komponen custom | Konsisten, cepat dikembangkan, mudah styling elegan |
| Animasi | **Framer Motion** | Standar untuk micro-interaction & transisi halus di React |
| Database | **Supabase (PostgreSQL) / atau alternatif serupa** | Sudah termasuk Auth (untuk login admin) + Storage (untuk upload foto produk) dalam satu paket |
| Hosting Frontend | **Vercel** | Native untuk Next.js, deploy otomatis |
| Image Handling | `next/image` + Supabase Storage / Cloudinary | Optimasi otomatis, penting karena web ini sangat bergantung pada foto produk |
| Integrasi WA | Generate link `wa.me/<nomor>?text=<pesan>` | Tidak butuh API berbayar, cukup link WhatsApp biasa (WhatsApp Click-to-Chat) |

**Penting:** Nomor WA tujuan, nama toko, template pesan → **semua diambil dari database**, bukan ditulis langsung (hardcode) di kode. Ini krusial supaya kakak bisa ganti sendiri dari dashboard tanpa minta bantuan lagi ke developer/agent.

---

## 9. Rencana Sistem Reseller/Agent (Masa Depan) — Analisis & Rekomendasi

Ini menjawab pertanyaan kamu: **"masa iya disatuin di web yang sama, atau dibuat di web beda aja nanti?"**

### Opsi A — Satu Website, Arsitektur Multi-Toko/Multi-Reseller
Setiap reseller punya "sub-etalase" sendiri di dalam sistem yang sama (misalnya lewat sub-path atau subdomain: `nadhirahstore.com/reseller/nama` atau `namareseller.nadhirahstore.com`), tapi tetap satu basis data & satu basis kode.

**Kelebihan:**
- Hemat biaya maintenance jangka panjang (satu sistem untuk dikelola, bukan dua).
- Reseller otomatis dapat katalog produk terbaru dari toko pusat tanpa upload ulang.
- Branding pusat (Nadhirah Store) tetap terjaga, reseller jadi "cabang resmi".

**Kekurangan:**
- Perlu desain database & sistem izin (permission) yang lebih matang sejak awal (siapa boleh lihat/edit apa).
- Sedikit lebih kompleks saat development dibanding sistem tunggal sederhana.

### Opsi B — Website Terpisah untuk Reseller
Reseller punya website/sistem sendiri yang berbeda sama sekali dari Nadhirah Store.

**Kelebihan:**
- Development awal (sekarang) jadi lebih simpel karena tidak perlu mikir reseller sama sekali.
- Kalau nanti sistem reseller ternyata butuh fitur sangat berbeda, tidak saling mengganggu.

**Kekurangan:**
- Duplikasi kerja: harus bangun ulang katalog produk, desain, dashboard dari nol.
- Sinkronisasi data produk antara toko pusat dan reseller jadi manual/ribet (reseller bisa jual info harga/stok yang sudah tidak update).
- Biaya hosting & maintenance dobel.

### **Rekomendasi**
✅ **Bangun satu sistem (Opsi A), tapi jangan kerjakan fitur reseller sekarang.**

Cukup pastikan struktur database di Fase 1 sudah "ramah masa depan", contoh:
- Tabel produk punya kolom `store_id` atau `owner_id` (meski untuk sekarang isinya cuma 1 nilai: Nadhirah Store) — supaya nanti gampang ditambah `store_id` lain untuk reseller.
- Sistem admin dirancang berbasis role (`admin`, dan nanti tinggal ditambah role `reseller`) daripada hardcode "hanya 1 admin".

Dengan begini, saat suatu hari kamu benar-benar butuh fitur reseller, AI Agent (di Antigravity atau siapapun yang lanjutkan) **tinggal menambah fitur**, bukan membongkar ulang seluruh sistem dari nol. Ini disebut prinsip **"desain untuk ekstensibilitas"** — tidak over-engineering di awal, tapi juga tidak menutup pintu.

> ⚠️ Instruksi eksplisit untuk AI Agent: **Jangan bangun UI atau fitur reseller apapun di Fase 1.** Cukup pastikan skema database mengikuti poin di atas.

---

## 10. Struktur Data (Skema Database — Level Konsep)

```
Table: store_settings
- id
- store_name          (default: "Nadhirah Store")
- logo_url
- tagline
- whatsapp_number
- wa_message_template
- theme_color
- social_links (json)
- address
- operational_hours

Table: categories
- id
- name
- image_url
- slug

Table: products
- id
- category_id (FK -> categories)
- store_id            (siap untuk multi-toko di masa depan, default: 1)
- name
- slug
- description
- price
- discount_price (nullable)
- is_featured (boolean)
- status (active / inactive / pre_order / sold_out)
- created_at / updated_at

Table: product_images
- id
- product_id (FK -> products)
- image_url
- is_watermarked (boolean)
- order_index

Table: product_variants
- id
- product_id (FK -> products)
- variant_name   (contoh: "Ukuran M - Merah")
- stock

Table: admins
- id
- email
- password_hash
- role   (contoh: "owner" — siap ditambah "reseller" nanti)

Table: banners
- id
- image_url
- order_index
- link_url (nullable)
```

---

## 11. Peta Situs (Sitemap)

```
/                       → Homepage
/produk                 → Katalog semua produk (dengan filter & search)
/produk/[slug]          → Detail produk
/kategori/[slug]        → Katalog produk per kategori
/tentang                → Tentang toko
/kontak                 → Kontak & lokasi
/faq                    → FAQ (opsional)

--- Admin (protected) ---
/admin/login
/admin/dashboard
/admin/produk           → List & kelola produk
/admin/produk/tambah
/admin/produk/[id]/edit
/admin/kategori
/admin/banner
/admin/pengaturan-toko  → Nama toko, logo, WA, warna tema, dll
```

---

## 12. Alur Pengguna Utama (Customer Journey)

```
1. User buka homepage (dari IG/TikTok bio link atau share link)
        ↓
2. Lihat produk unggulan / browsing katalog
        ↓
3. Klik salah satu produk → halaman detail
        ↓
4. Pilih varian (ukuran/warna) jika tersedia
        ↓
5. Klik "Pesan via WhatsApp"
        ↓
6. Terbuka WhatsApp (app/web) dengan pesan otomatis terisi
        ↓
7. Transaksi lanjut manual antara admin (kakak) & pembeli di WA
```

---

## 13. Kebutuhan Non-Fungsional

| Aspek | Requirement |
|-------|-------------|
| Performa | Halaman utama & katalog harus load cepat (< 2.5 detik di koneksi mobile rata-rata). Gunakan lazy-loading gambar. |
| SEO | Meta title/description per halaman & produk (agar produk bisa muncul di pencarian Google/Google Shopping). Gunakan struktur URL yang bersih (`/produk/nama-produk`). |
| Keamanan | Halaman admin wajib di-protect (tidak bisa diakses tanpa login). Password di-hash, bukan plain text. |
| Skalabilitas | Struktur data mendukung penambahan produk dalam jumlah besar tanpa penurunan performa (pagination/infinite scroll wajib). |
| Aksesibilitas | Kontras warna cukup jelas, ukuran tombol cukup besar untuk tap di mobile, alt text pada gambar produk. |
| Maintenance | Semua konten (bukan sekadar produk) — teks, warna, nomor WA — harus bisa diubah tanpa sentuh kode. |

---

## 14. Instruksi Khusus untuk AI Agent (Antigravity)

1. **Prioritaskan Fase 1 (MVP)** sesuai Bagian 4. Jangan bangun fitur Fase 2/3 kecuali diminta eksplisit.
2. **Jangan hardcode** nama toko, nomor WA, warna tema, atau teks template pesan WA — semua harus dari database/pengaturan (Bagian 6.2 & 10).
3. Ikuti struktur data di Bagian 10 sebagai baseline skema database, boleh disesuaikan/dinormalisasi asal prinsip fleksibilitasnya tetap (khususnya kolom `store_id` dan `role` di tabel admin).
4. Implementasikan desain sesuai arahan di Bagian 7 — fokus ke kesan elegan & interaktif, tapi tetap ringan (jangan korbankan kecepatan loading demi animasi).
5. Setiap halaman customer harus responsive dan diuji tampilannya di breakpoint mobile terlebih dahulu (mobile-first).
6. Sertakan dokumentasi singkat cara admin login & mengganti nama toko/logo/nomor WA pertama kali (semacam quick-start guide untuk owner non-teknis).
7. **Jangan implementasikan fitur reseller/multi-toko** di iterasi ini — cukup pastikan skema data tidak menutup kemungkinan tersebut (lihat Bagian 9).
8. Struktur folder project disarankan mengikuti konvensi standar Next.js App Router (`/app`, `/components`, `/lib`, `/types`) agar mudah di-maintain developer lain di masa depan.
9. Sertakan fitur "Salin Link Produk" (share) di halaman detail produk (Bagian 5.3) — gunakan Web Share API untuk mobile jika didukung, fallback ke copy-to-clipboard.
10. Sertakan status produk "Pre-Order" sebagai opsi terpisah dari "Habis" (Bagian 6.3 & 10) — tampilkan badge berbeda agar pembeli tidak bingung antara "sudah habis" dan "belum ready stock".
11. Fitur watermark otomatis pada foto produk (Bagian 6.3) bersifat opsional/toggle, bukan wajib menyala — biarkan admin yang memutuskan per foto atau secara global.
12. Sediakan tombol export data produk ke CSV di dashboard admin (Bagian 6.7), dan pastikan layanan database yang dipakai punya backup otomatis aktif.

---

## 15. Panduan Menghindari "AI Slop" (Wajib Dibaca Agent Sebelum Styling)

"AI Slop" = ciri khas web yang keliatan "dibuat AI asal jadi" — teknisnya jalan, tapi terasa generik, hambar, dan pasaran. Untuk toko fashion yang jual "elegan & keren", ini harus dihindari total.

### 15.1 Ciri-ciri "AI Slop" yang WAJIB DIHINDARI
- **Font default tanpa hierarki** — semua teks pakai Inter/Roboto rata, judul dan body tidak dibedakan gaya/karakternya.
- **Gradient ungu-biru generik** ala template SaaS/startup (biasanya dari default Tailwind `from-purple-500 to-indigo-500`).
- **Ikon emoji** dipakai sebagai pengganti ikon desain (🛍️✨🔥 di mana-mana).
- **Card seragam** — semua elemen pakai `rounded-2xl` + `shadow-md` tanpa variasi visual sama sekali, jadi terasa "template dashboard", bukan toko fashion.
- **Copywriting template AI**, contoh yang harus dihindari: *"Temukan koleksi terbaik kami!"*, *"Belanja jadi lebih mudah!"*, *"Kualitas terbaik dengan harga terjangkau!"* — kalimat generik yang bisa dipasang di toko manapun tanpa personality.
- **Layout simetris membosankan** — grid 3 kolom rata tanpa titik fokus, tanpa variasi ukuran gambar/section.
- **Foto stock generik** (model random dari internet, tidak related ke brand) dipakai sebagai pengganti foto produk asli.
- **Warna aksen default** (violet/indigo/blue bawaan Tailwind) tanpa disesuaikan ke identitas brand toko.

### 15.2 Instruksi Konkret untuk Agent
1. **Wajib pilih 1 pasangan font spesifik** (bukan default framework) dan 1 palet warna spesifik **sebelum** mulai coding UI — tuliskan pilihan ini di awal sebagai bagian dari dokumentasi desain (lihat rekomendasi di Bagian 16).
2. **Variasikan layout antar section** — jangan semua section polanya sama (misal: section 1 gambar kiri-teks kanan, section 2 full-width gambar, section 3 grid asimetris — bukan grid rata terus-menerus).
3. **Copywriting harus personal & spesifik ke brand**, bukan kalimat template. Kalau perlu, agent boleh tanya ke pemilik toko soal tone bahasa yang diinginkan (santai? sopan-formal? hangat kekeluargaan?).
4. **Semua foto produk = foto asli**, placeholder sementara boleh dari sumber di Bagian 16, tapi wajib ditandai jelas sebagai "TODO: ganti foto asli" agar tidak lolos ke produksi.
5. **Detail kecil yang menunjukkan effort**: custom empty state (misal saat produk habis/kosong), custom 404 page, custom loading state — bukan bawaan/default framework.
6. Hindari elemen dekoratif yang tidak fungsional (misal ilustrasi 3D generic atau blob gradient acak) kecuali benar-benar mendukung identitas brand.

---

## 16. Referensi & Sumber Skill/Resource untuk Agent

Bagian ini menjawab: **"agent dapat skill/referensinya dari mana?"** — supaya hasil desain tidak asal generate dari "pengetahuan umum" AI, tapi merujuk ke sumber nyata yang memang dipakai desainer profesional.

| Kebutuhan | Sumber Rekomendasi | Link |
|-----------|---------------------|------|
| Inspirasi layout & UI premium | Awwwards (kurasi web terbaik dunia) | awwwards.com |
| Inspirasi UI e-commerce fashion | Dribbble, filter "fashion ecommerce" | dribbble.com |
| Pola UI mobile nyata (real app, bukan konsep) | Mobbin | mobbin.com |
| Inspirasi landing page nyata | Land-book | land-book.com |
| Font pairing (heading + body) | Google Fonts | fonts.google.com |
| Contoh pairing elegan yang bisa dicoba | Serif elegan: **Fraunces**, **Cormorant Garamond**, **Playfair Display** — dipasangkan dengan sans bersih: **Manrope**, **Work Sans**, **Inter** (hanya untuk body, bukan heading) | fonts.google.com |
| Ikon set custom (bukan emoji) | Lucide Icons (ringan, konsisten, cocok untuk web modern) atau Phosphor Icons (lebih soft/elegan) | lucide.dev, phosphoricons.com |
| Base komponen UI (harus di-restyle, jangan dipakai polos) | shadcn/ui | ui.shadcn.com |
| Animasi & transisi halus | Framer Motion (docs resmi) | framer.com/motion |
| Eksplorasi & validasi palet warna | Coolors, atau Realtime Colors (bisa preview langsung di layout mockup) | coolors.co, realtimecolors.com |
| Placeholder foto sementara (SEBELUM ada foto produk asli) | Unsplash / Pexels — WAJIB diganti foto asli sebelum go-live | unsplash.com, pexels.com |
| Referensi "rasa"/tone brand fashion Muslimah lokal | Pelajari toko-toko fashion muslimah yang sudah punya identitas visual kuat sebagai referensi *rasa* desain — bukan untuk dicontek/ditiru mentah-mentah | (riset mandiri oleh agent/owner) |

### Catatan Penting
- Sumber-sumber di atas untuk **referensi & bahan mentah** (font, ikon, komponen dasar), bukan untuk di-copy-paste desainnya secara instan. Agent tetap harus meracik kombinasinya jadi identitas visual yang khas untuk Nadhirah Store.
- Semua aset (font, ikon) yang dipakai harus **gratis untuk penggunaan komersial** — cek lisensi masing-masing sebelum dipakai di produksi (Google Fonts & Lucide/Phosphor aman dipakai komersial gratis).
- Kalau nanti kakak punya foto produk profesional/branding kit sendiri, itu prioritas utama dibanding semua referensi di atas.

---

## 17. Ringkasan Prioritas (Quick Checklist untuk Mulai Development)

- [ ] Tentukan 1 pasangan font + 1 palet warna spesifik (Bagian 15 & 16) — SEBELUM mulai coding UI
- [ ] Setup project (Next.js + Tailwind + Framer Motion)
- [ ] Setup database (Supabase/alternatif) + skema tabel (Bagian 10)
- [ ] Halaman admin: login + pengaturan toko
- [ ] Admin: CRUD produk + kategori + banner
- [ ] Homepage (hero, featured products, kategori)
- [ ] Halaman katalog produk + filter/search
- [ ] Halaman detail produk + tombol "Pesan via WhatsApp" + tombol "Salin Link"
- [ ] Halaman statis: tentang, kontak
- [ ] Fitur export data produk (CSV) di dashboard admin
- [ ] Pastikan backup otomatis database aktif di layanan hosting yang dipakai
- [ ] Testing responsive (mobile & desktop)
- [ ] Pastikan semua foto placeholder sudah diganti foto produk asli (bukan stock photo) sebelum go-live
- [ ] Deploy (Vercel)

---

*Dokumen ini bisa langsung diberikan ke AI Agent di Antigravity sebagai instruksi kerja. Jika ada detail yang ingin ditambah/diubah (misal warna tema spesifik, atau fitur tambahan), edit dulu dokumen ini sebelum diteruskan ke agent, supaya hasilnya tetap sesuai visi kamu.*
