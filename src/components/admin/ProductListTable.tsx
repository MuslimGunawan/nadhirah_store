"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  Download,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/store";

interface ProductRow {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  status: string;
  isFeatured: boolean;
  category: {
    name: string;
  };
  images: {
    imageUrl: string;
  }[];
  variants: {
    id: number;
    variantName: string;
    stock: number;
  }[];
}

interface ProductListTableProps {
  initialProducts: ProductRow[];
}

export default function ProductListTable({
  initialProducts,
}: ProductListTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ? true : p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert("Gagal menghapus produk");
      }
    } catch {
      alert("Terjadi kendala jaringan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk atau kategori..."
            className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <a
            href="/api/admin/export"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            title="Download CSV untuk arsip atau backup Excel"
          >
            <Download className="h-3.5 w-3.5 text-stone-500" />
            <span>Export CSV</span>
          </a>

          <Link
            href="/admin/produk/tambah"
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: "all", label: "Semua Status" },
          { id: "active", label: "Aktif" },
          { id: "pre_order", label: "Pre-Order" },
          { id: "sold_out", label: "Habis" },
          { id: "inactive", label: "Nonaktif" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === tab.id
                ? "bg-stone-900 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Varian & Stok</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => {
                const img =
                  p.images[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

                const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-9 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs space-y-0.5">
                          <p className="font-medium text-stone-900 truncate">
                            {p.name}
                          </p>
                          {p.isFeatured && (
                            <span className="inline-block text-[10px] font-semibold text-amber-700">
                              ★ Pilihan Utama
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-stone-600">
                      {p.category.name}
                    </td>

                    <td className="px-4 py-3">
                      {p.discountPrice ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-stone-900">
                            {formatPrice(p.discountPrice)}
                          </p>
                          <p className="text-[10px] text-stone-400 line-through">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                      ) : (
                        <span className="font-semibold text-stone-900">
                          {formatPrice(p.price)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "pre_order"
                            ? "bg-amber-100 text-amber-800"
                            : p.status === "sold_out"
                            ? "bg-stone-200 text-stone-700"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {p.status === "active"
                          ? "Aktif"
                          : p.status === "pre_order"
                          ? "Pre-Order"
                          : p.status === "sold_out"
                          ? "Habis"
                          : "Nonaktif"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-stone-600">
                      <p className="font-medium text-stone-800">
                        {totalStock} pcs total
                      </p>
                      <p className="text-[10px] text-stone-400">
                        ({p.variants.length} varian)
                      </p>
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/produk/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100"
                          title="Lihat halaman publik"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/admin/produk/${p.id}/edit`}
                          className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                          title="Edit produk"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                          title="Hapus produk"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-stone-300" />
                    <p>Tidak ada produk yang cocok dengan pencarian atau filter status.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
