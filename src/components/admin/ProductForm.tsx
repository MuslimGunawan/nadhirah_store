"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Check,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

interface CategoryOption {
  id: number;
  name: string;
}

interface ImageItem {
  imageUrl: string;
  isWatermarked: boolean;
}

interface VariantItem {
  variantName: string;
  stock: number;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: {
    id: number;
    name: string;
    slug: string;
    categoryId: number;
    description: string;
    price: number;
    discountPrice: number | null;
    isFeatured: boolean;
    status: string;
    images: { imageUrl: string; isWatermarked: boolean }[];
    variants: { variantName: string; stock: number }[];
  };
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || (categories[0]?.id ?? 1)
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discountPrice ? String(initialData.discountPrice) : ""
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [status, setStatus] = useState(initialData?.status || "active");

  const [images, setImages] = useState<ImageItem[]>(
    initialData?.images || []
  );
  const [variants, setVariants] = useState<VariantItem[]>(
    initialData?.variants && initialData.variants.length > 0
      ? initialData.variants
      : [
          { variantName: "All Size", stock: 10 },
        ]
  );

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    for (let i = 0; i < files.length; i++) {
      const data = new FormData();
      data.append("file", files[i]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        const result = await res.json();
        if (res.ok && result.url) {
          setImages((prev) => [
            ...prev,
            { imageUrl: result.url, isWatermarked: false },
          ]);
        }
      } catch {
        // Ignored
      }
    }
    setUploadingImage(false);
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [
      ...prev,
      { imageUrl: imageUrlInput.trim(), isWatermarked: false },
    ]);
    setImageUrlInput("");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const toggleImageWatermark = (index: number) => {
    setImages(
      images.map((img, idx) =>
        idx === index ? { ...img, isWatermarked: !img.isWatermarked } : img
      )
    );
  };

  const addVariantRow = () => {
    setVariants((prev) => [...prev, { variantName: "", stock: 5 }]);
  };

  const updateVariant = (
    index: number,
    field: "variantName" | "stock",
    value: string | number
  ) => {
    setVariants(
      variants.map((v, idx) =>
        idx === index ? { ...v, [field]: value } : v
      )
    );
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama produk wajib diisi");
      return;
    }
    if (!price || isNaN(Number(price))) {
      setError("Harga normal wajib berupa angka valid");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        categoryId: Number(categoryId),
        description: description.trim(),
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        isFeatured,
        status,
        images,
        variants,
      };

      const url = isEditing
        ? `/api/admin/products/${initialData!.id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan produk");
      }

      router.push("/admin/produk");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kendala");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/produk"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Daftar Produk</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="font-serif text-lg font-normal text-stone-900">
            1. Informasi Dasar Produk
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Nama Produk Busana
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Malika Silk Abaya Noir"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Slug URL (Otomatis)
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-mono text-stone-700 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Kategori Produk
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Harga Normal (Rp)
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="395000"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Harga Diskon / Coret (Rp, Opsional)
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Kosongkan jika tidak ada promo"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Status Ketersediaan
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800 cursor-pointer"
            >
              <option value="active">Aktif (Ready Stock Siap Pesan)</option>
              <option value="pre_order">Pre-Order (PO 7-10 Hari)</option>
              <option value="sold_out">Stok Habis</option>
              <option value="inactive">Nonaktif (Sembunyikan dari Toko)</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="text-xs font-medium text-stone-900">
                Tampilkan di Beranda sebagai &quot;Koleksi Pilihan / Terfavorit&quot;
              </span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Deskripsi & Karakteristik Bahan
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan jenis kain (Armani Silk, Ceruty Babydoll, dll), bukaan busui/wudhu, kenyamanan, dan keanggunan siluetnya..."
              className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>
        </div>
      </div>

      {/* Multi-Photo Management with Watermark Toggle */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="font-serif text-lg font-normal text-stone-900">
            2. Foto & Galeri Produk
          </h2>
          <p className="text-xs text-stone-500">
            Unggah foto dari perangkat Anda atau masukkan link gambar langsung. Anda dapat menyalakan tanda air (watermark) opsional untuk mencegah pencurian foto.
          </p>
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors shrink-0">
            <Upload className="h-4 w-4" />
            <span>{uploadingImage ? "Mengunggah..." : "Upload Foto dari Komputer"}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="flex-1 flex gap-2">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Atau tempel link URL foto (https://...)"
              className="flex-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="rounded-xl bg-stone-200 px-3.5 py-2 text-xs font-medium text-stone-800 hover:bg-stone-300 transition-colors cursor-pointer"
            >
              Tambah Link
            </button>
          </div>
        </div>

        {/* Image Grid Preview */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group"
              >
                <Image
                  src={img.imageUrl}
                  alt={`Preview ${idx + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover"
                />

                {/* Index badge */}
                <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  Foto {idx + 1} {idx === 0 && "(Utama)"}
                </span>

                {/* Watermark toggle */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 bg-black/70 backdrop-blur-xs p-1.5 rounded-lg text-[10px] text-white">
                  <button
                    type="button"
                    onClick={() => toggleImageWatermark(idx)}
                    className="flex items-center gap-1 hover:text-amber-300"
                  >
                    <ShieldAlert
                      className={`h-3 w-3 ${
                        img.isWatermarked ? "text-amber-400" : "text-stone-400"
                      }`}
                    />
                    <span>{img.isWatermarked ? "Watermark ON" : "No Watermark"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Hapus foto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Belum ada foto yang ditambahkan. Harap tambahkan minimal 1 foto produk.
          </p>
        )}
      </div>

      {/* Variants & Stock Management */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 className="font-serif text-lg font-normal text-stone-900">
              3. Varian Ukuran & Stok
            </h2>
            <p className="text-xs text-stone-500">
              Pengunjung wajib memilih varian sebelum memesan via WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={addVariantRow}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Varian</span>
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/50"
            >
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-semibold text-stone-500 mb-1">
                  Nama Varian (Ukuran / Warna)
                </label>
                <input
                  type="text"
                  required
                  value={v.variantName}
                  onChange={(e) =>
                    updateVariant(idx, "variantName", e.target.value)
                  }
                  placeholder="Contoh: Size S - Hitam"
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                />
              </div>

              <div className="w-28">
                <label className="block text-[10px] uppercase font-semibold text-stone-500 mb-1">
                  Jumlah Stok
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(idx, "stock", Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  disabled={variants.length <= 1}
                  className="p-2 text-stone-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                  title="Hapus varian"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Submission */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/produk"
          className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Menyimpan Data..." : "Simpan Produk"}</span>
        </button>
      </div>
    </form>
  );
}
