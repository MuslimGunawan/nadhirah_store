"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Upload, AlertCircle, Check } from "lucide-react";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  _count?: {
    products: number;
  };
}

interface CategoryManagerProps {
  initialCategories: CategoryItem[];
}

export default function CategoryManager({
  initialCategories,
}: CategoryManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setImageUrl("");
    setError("");
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setImageUrl(cat.imageUrl || "");
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
    if (!name.trim()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          imageUrl: imageUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan kategori");
      }

      setSuccess(
        editingId
          ? "Kategori berhasil diperbarui!"
          : "Kategori baru berhasil ditambahkan!"
      );
      resetForm();
      router.refresh();
      // Reload categories from state
      if (editingId) {
        setCategories(
          categories.map((c) =>
            c.id === editingId
              ? { ...c, name: data.category.name, slug: data.category.slug, imageUrl: data.category.imageUrl }
              : c
          )
        );
      } else {
        setCategories([...categories, { ...data.category, _count: { products: 0 } }]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kendala");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    if (!confirm(`Hapus kategori "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal menghapus kategori");
        return;
      }

      setCategories(categories.filter((c) => c.id !== id));
      router.refresh();
    } catch {
      alert("Terjadi kendala saat menghapus kategori");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Category List */}
      <div className="lg:col-span-7 space-y-4">
        <h2 className="font-serif text-lg font-normal text-stone-900">
          Daftar Kategori ({categories.length})
        </h2>

        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs">
          <div className="divide-y divide-stone-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px] text-stone-400">
                        No Foto
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-stone-900">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-400">
                      Slug: /{cat.slug} • {cat._count?.products ?? 0} produk
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                    title="Edit kategori"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                    title="Hapus kategori"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Create/Edit Form */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="font-serif text-lg font-normal text-stone-900">
              {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
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
                Nama Kategori
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "")
                    );
                  }
                }}
                placeholder="Contoh: Mukena & Sajadah"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Slug URL (Otomatis)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mukena-sajadah"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-mono text-stone-700 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Foto Sampul Kategori
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
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

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer mt-2"
            >
              {editingId ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>{saving ? "Menyimpan..." : "Perbarui Kategori"}</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>{saving ? "Menyimpan..." : "Tambah Kategori"}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
