"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Upload, AlertCircle, Check } from "lucide-react";

interface BannerItem {
  id: number;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
  orderIndex: number;
  isActive: boolean;
}

interface BannerManagerProps {
  initialBanners: BannerItem[];
}

export default function BannerManager({ initialBanners }: BannerManagerProps) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/produk");
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setLinkUrl("/produk");
    setOrderIndex(banners.length);
    setIsActive(true);
    setError("");
  };

  const handleEdit = (b: BannerItem) => {
    setEditingId(b.id);
    setTitle(b.title || "");
    setSubtitle(b.subtitle || "");
    setImageUrl(b.imageUrl);
    setLinkUrl(b.linkUrl || "/produk");
    setOrderIndex(b.orderIndex);
    setIsActive(b.isActive);
    setError("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (res.ok && result.url) {
        setImageUrl(result.url);
      }
    } catch {
      // Ignored
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Foto banner wajib diunggah");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId
        ? `/api/admin/banners/${editingId}`
        : "/api/admin/banners";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          subtitle: subtitle.trim() || null,
          imageUrl: imageUrl.trim(),
          linkUrl: linkUrl.trim() || "/produk",
          orderIndex: Number(orderIndex),
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan banner");
      }

      setSuccess(
        editingId
          ? "Banner berhasil diperbarui!"
          : "Banner baru berhasil ditambahkan!"
      );
      resetForm();
      router.refresh();

      if (editingId) {
        setBanners(
          banners.map((b) => (b.id === editingId ? data.banner : b))
        );
      } else {
        setBanners([...banners, data.banner]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kendala");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus banner ini?")) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBanners(banners.filter((b) => b.id !== id));
        router.refresh();
      } else {
        alert("Gagal menghapus banner");
      }
    } catch {
      alert("Terjadi kendala jaringan");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Banner List */}
      <div className="lg:col-span-7 space-y-4">
        <h2 className="font-serif text-lg font-normal text-stone-900">
          Banner Aktif di Beranda ({banners.length})
        </h2>

        <div className="space-y-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs"
            >
              <div className="relative h-44 w-full bg-stone-900">
                <Image
                  src={b.imageUrl}
                  alt={b.title || "Banner"}
                  fill
                  sizes="400px"
                  className="object-cover brightness-90"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-white ${
                      b.isActive ? "bg-emerald-600" : "bg-stone-600"
                    }`}
                  >
                    {b.isActive ? "Tayang Aktif" : "Dinonaktifkan"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-normal text-stone-900">
                    {b.title || "(Tanpa Judul Banner)"}
                  </h3>
                  {b.subtitle && (
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {b.subtitle}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400">
                    Link Tujuan: <code className="text-stone-600">{b.linkUrl || "/produk"}</code>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                    title="Edit banner"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                    title="Hapus banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center text-xs text-stone-400">
              Belum ada banner promo di beranda. Tambahkan melalui formulir di samping.
            </div>
          )}
        </div>
      </div>

      {/* Banner Create/Edit Form */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="font-serif text-lg font-normal text-stone-900">
              {editingId ? "Edit Banner Hero" : "Tambah Banner Baru"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-stone-500 hover:underline"
              >
                Batal Edit
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Foto Banner
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... atau upload file"
                  className="flex-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                />
                <label className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700 hover:bg-stone-100 cursor-pointer flex items-center gap-1 shrink-0">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploading ? "..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Judul Utama Banner
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Koleksi Raya & Signature Series"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Sub-judul / Keterangan
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Sentuhan kemewahan dalam kesederhanaan bersahaja..."
                className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Link Tombol CTA
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/produk atau /kategori/gamis-abaya"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="bannerActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <label htmlFor="bannerActive" className="text-xs text-stone-700">
                Tayangkan banner ini di beranda
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer mt-2"
            >
              {editingId ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>{saving ? "Menyimpan..." : "Perbarui Banner"}</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>{saving ? "Menyimpan..." : "Tambah Banner"}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
