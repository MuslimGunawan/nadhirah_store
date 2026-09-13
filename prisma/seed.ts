import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Nadhirah Store",
      tagline: "Koleksi Busana Muslimah Elegan & Bersahaja",
      whatsappNumber: "6281298765432",
      waMessageTemplate: `Halo Kak {store_name}, saya mau tanya/pesan produk ini:
- Nama Produk: {product_name}
- Varian: {variant}
- Harga: {price}
- Link: {product_url}

Apakah stok masih tersedia kak?`,
      themeColor: "rose",
      socialLinks: JSON.stringify({
        instagram: "https://instagram.com/nadhirah.store",
        tiktok: "https://tiktok.com/@nadhirahstore",
      }),
      address: "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan",
      operationalHours: "Senin - Sabtu: 09.00 - 18.00 WIB",
    },
  });

  // 2. Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@nadhirah.com" },
    update: { passwordHash: hashedPassword },
    create: {
      email: "admin@nadhirah.com",
      passwordHash: hashedPassword,
      role: "owner",
    },
  });

  // 3. Categories
  const categoriesData = [
    {
      name: "Gamis & Abaya",
      slug: "gamis-abaya",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Hijab & Scarf",
      slug: "hijab-scarf",
      imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Tunik & Blouse",
      slug: "tunik-blouse",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "One Set & Setelan",
      slug: "one-set",
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const categoriesMap: Record<string, number> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, imageUrl: cat.imageUrl },
      create: cat,
    });
    categoriesMap[cat.slug] = created.id;
  }

  // 4. Products
  const productsData = [
    {
      name: "Malika Silk Abaya Noir",
      slug: "malika-silk-abaya-noir",
      categorySlug: "gamis-abaya",
      description: "Abaya berpotongan A-line anggun berbahan Armani Silk impor dengan tekstur lembut berkilau satin halus. Dilengkapi aksen lipit minimalis di bagian dada serta bukaan resleting depan yang ramah busui. Nyaman dikenakan sepanjang hari untuk acara formal maupun silaturahmi.",
      price: 395000,
      discountPrice: 355000,
      isFeatured: true,
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "Size S - Jet Black", stock: 8 },
        { variantName: "Size M - Jet Black", stock: 12 },
        { variantName: "Size L - Jet Black", stock: 5 },
        { variantName: "Size XL - Jet Black", stock: 3 },
      ],
    },
    {
      name: "Safira Pleated Gamis Rose Taupe",
      slug: "safira-pleated-gamis-rose-taupe",
      categorySlug: "gamis-abaya",
      description: "Gamis elegan dengan detail pleats rapat di bagian rok bawah yang memberikan siluet jenjang dan anggun. Dibuat dari bahan Ceruty Babydoll Premium berlapis furing katun adem yang tidak menerawang. Aksen manset wudhu-friendly dengan kancing mutiara klasik.",
      price: 420000,
      discountPrice: null,
      isFeatured: true,
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "Size M - Rose Taupe", stock: 10 },
        { variantName: "Size L - Rose Taupe", stock: 7 },
        { variantName: "Size XL - Rose Taupe", stock: 4 },
      ],
    },
    {
      name: "Noor Pashmina Silk Motif Signature",
      slug: "noor-pashmina-silk-motif-signature",
      categorySlug: "hijab-scarf",
      description: "Hijab segi empat bermotif monogram eksklusif khas Nadhirah Store. Menggunakan material Voal Ultrafine Silk dengan ketegakan sempurna di dahi tanpa perlu semprotan kaku. Pinggiran dipotong dengan teknologi laser-cut presisi tinggi yang mewah.",
      price: 185000,
      discountPrice: 159000,
      isFeatured: true,
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "115x115cm - Dusty Rose", stock: 25 },
        { variantName: "115x115cm - Almond Cream", stock: 20 },
        { variantName: "115x115cm - Sage Mist", stock: 15 },
      ],
    },
    {
      name: "Ayla Linen Tunik Minimalis",
      slug: "ayla-linen-tunik-minimalis",
      categorySlug: "tunik-blouse",
      description: "Tunik panjang berpotongan asimetris modern berbahan Linen Rami Premium dengan karakter serat alami yang estetik dan breathable. Dilengkapi saku samping tersembunyi dan kerah shanghai bersahaja. Padukan dengan celana kulot atau rok plisket kesayangan.",
      price: 265000,
      discountPrice: 235000,
      isFeatured: false,
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "All Size - Broken White", stock: 14 },
        { variantName: "All Size - Oat Beige", stock: 9 },
        { variantName: "All Size - Olive Green", stock: 0 },
      ],
    },
    {
      name: "Zahra Co-ord Setelan Kulot Flowy",
      slug: "zahra-co-ord-setelan-kulot-flowy",
      categorySlug: "one-set",
      description: "Setelan atasan kemeja drop-shoulder santai dipadukan celana kulot berpinggang karet elastis. Material Rayon Crinkle Twill bertekstur jatuh lembut, anti-kusut, dan sangat sejuk untuk kegiatan sehari-hari maupun liburan keluarga.",
      price: 345000,
      discountPrice: null,
      isFeatured: true,
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "Size M - Terracotta", stock: 6 },
        { variantName: "Size L - Terracotta", stock: 8 },
        { variantName: "Size XL - Terracotta", stock: 5 },
      ],
    },
    {
      name: "Raya Special Edition Kaftan Maroko",
      slug: "raya-special-edition-kaftan-maroko",
      categorySlug: "gamis-abaya",
      description: "Kaftan edisi terbatas dengan bordir sulam tangan bernuansa geometris Maroko di sepanjang leher dan lengan. Menggunakan bahan Silk Organza berfuring sutra dingin. Produk Pre-Order (estimasi pengerjaan 7-10 hari kerja).",
      price: 580000,
      discountPrice: null,
      isFeatured: true,
      status: "pre_order",
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "All Size - Emerald Gold", stock: 15 },
        { variantName: "All Size - Pearl White", stock: 10 },
      ],
    },
    {
      name: "Hawa Silk Square Khimar",
      slug: "hawa-silk-square-khimar",
      categorySlug: "hijab-scarf",
      description: "Khimar segi empat ukuran syari 130x130cm berbahan Silky Voal Luxury. Jatuh anggun, tidak menjiplak leher, dan adem saat dipakai dalam cuaca tropis.",
      price: 210000,
      discountPrice: 189000,
      isFeatured: false,
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "130x130cm - Nude Brown", stock: 12 },
        { variantName: "130x130cm - Lavender Grey", stock: 8 },
      ],
    },
    {
      name: "Fatima Classic Trench Outerwear",
      slug: "fatima-classic-trench-outerwear",
      categorySlug: "tunik-blouse",
      description: "Outerwear panjang berkerah lapel dengan ikat pinggang senada berbahan Cotton Twill lembut. Model serbaguna untuk melengkapi busana santai atau busana kerja Anda.",
      price: 380000,
      discountPrice: null,
      isFeatured: false,
      status: "sold_out",
      images: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
      ],
      variants: [
        { variantName: "Size M - Khaki", stock: 0 },
        { variantName: "Size L - Khaki", stock: 0 },
      ],
    },
  ];

  for (const p of productsData) {
    const categoryId = categoriesMap[p.categorySlug];
    if (!categoryId) continue;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        isFeatured: p.isFeatured,
        status: p.status,
      },
      create: {
        name: p.name,
        slug: p.slug,
        categoryId,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        isFeatured: p.isFeatured,
        status: p.status,
        storeId: 1,
      },
    });

    // Delete existing images & variants for clean seed
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productVariant.deleteMany({ where: { productId: product.id } });

    // Insert Images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: p.images[i],
          orderIndex: i,
          isWatermarked: false,
        },
      });
    }

    // Insert Variants
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          variantName: v.variantName,
          stock: v.stock,
        },
      });
    }
  }

  // 5. Banners
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      {
        title: "Koleksi Signature — Sentuhan Anggun Bersahaja",
        subtitle: "Didesain dengan potongan presisi dan material premium untuk kenyamanan setiap momen istimewa.",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
        linkUrl: "/produk",
        orderIndex: 0,
        isActive: true,
      },
      {
        title: "Pashmina & Scarf Silk Series",
        subtitle: "Seri motif monogram eksklusif dengan draping lembut dan kilau halus.",
        imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1600&auto=format&fit=crop",
        linkUrl: "/kategori/hijab-scarf",
        orderIndex: 1,
        isActive: true,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
