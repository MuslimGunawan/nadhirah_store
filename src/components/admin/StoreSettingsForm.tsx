"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, Save, Upload, Sparkles } from "lucide-react";
import { FormattedSettings } from "@/lib/store";

interface StoreSettingsFormProps {
  initialSettings: FormattedSettings;
}

export default function StoreSettingsForm({
  initialSettings,
}: StoreSettingsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: initialSettings.storeName,
    logoUrl: initialSettings.logoUrl || "",
    tagline: initialSettings.tagline,
    whatsappNumber: initialSettings.whatsappNumber,
    waMessageTemplate: initialSettings.waMessageTemplate,
    themeColor: initialSettings.themeColor || "rose",
    instagram: initialSettings.socialLinks?.instagram || "",
    tiktok: initialSettings.socialLinks?.tiktok || "",
    address: initialSettings.address || "",
    operationalHours: initialSettings.operationalHours || "",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const themePresets = [
    { id: "rose", name: "Rose Taupe", color: "#9F4D60", desc: "Nuansa feminin lembut & mewah" },
    { id: "terracotta", name: "Terracotta", color: "#C2410C", desc: "Nuansa hangat bersahaja" },
    { id: "sage", name: "Sage Mist", color: "#4D7C0F", desc: "Nuansa tenang & natural" },
    { id: "gold", name: "Warm Gold", color: "#B45309", desc: "Nuansa elegan kemilau" },
    { id: "noir", name: "Noir Classic", color: "#1C1917", desc: "Monokrom abaya minimalis" },
  ];

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, logoUrl: result.url }));
      }
    } catch {
      alert("Gagal mengupload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan data");
      }

      setMessage({ text: "Pengaturan profil toko berhasil diperbarui!", type: "success" });
      router.refresh();
    } catch {
      setMessage({ text: "Gagal menyimpan perubahan. Coba lagi.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Bagian 1: Identitas Toko */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="font-serif text-lg font-normal text-stone-900">
            1. Identitas & Branding Toko
          </h2>
          <p className="text-xs text-stone-500">
            Nama toko dan identitas ini akan muncul di seluruh header, footer, dan pesan WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Nama Toko
            </label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) =>
                setFormData({ ...formData, storeName: e.target.value })
              }
              placeholder="Contoh: Nadhirah Store"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Tagline / Slogan Toko
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              placeholder="Contoh: Koleksi Busana Muslimah Elegan & Bersahaja"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Logo Toko (Opsional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>{uploadingLogo ? "Mengunggah..." : "Pilih File Logo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {formData.logoUrl && (
                <span className="text-xs text-emerald-600 truncate max-w-xs">
                  Logo terunggah
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Integrasi WhatsApp */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="font-serif text-lg font-normal text-stone-900">
            2. Nomor WhatsApp & Template Pesan Transaksi
          </h2>
          <p className="text-xs text-stone-500">
            Saat pelanggan mengklik tombol &quot;Pesan via WhatsApp&quot;, chat akan diarahkan ke nomor ini dengan format pesan di bawah.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Nomor WhatsApp Tujuan (Gunakan Format 628...)
            </label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) =>
                setFormData({ ...formData, whatsappNumber: e.target.value })
              }
              placeholder="Contoh: 6281298765432"
              className="w-full sm:max-w-md rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Gunakan kode negara (62), contoh: 6281234567890 (jangan pakai tanda + atau spasi).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Template Pesan Otomatis WhatsApp
            </label>
            <textarea
              rows={6}
              value={formData.waMessageTemplate}
              onChange={(e) =>
                setFormData({ ...formData, waMessageTemplate: e.target.value })
              }
              className="w-full rounded-xl border border-stone-200 bg-white p-3.5 text-xs sm:text-sm text-stone-900 font-mono focus:outline-hidden focus:border-stone-800"
            />
            <div className="mt-2 rounded-lg bg-stone-50 p-3 text-[11px] text-stone-600 space-y-1">
              <p className="font-semibold text-stone-800">Variabel yang dapat dipakai otomatis:</p>
              <p><code className="bg-white px-1 py-0.5 rounded border border-stone-200">&#123;store_name&#125;</code> = Nama Toko</p>
              <p><code className="bg-white px-1 py-0.5 rounded border border-stone-200">&#123;product_name&#125;</code> = Nama Produk</p>
              <p><code className="bg-white px-1 py-0.5 rounded border border-stone-200">&#123;variant&#125;</code> = Varian yang dipilih pembeli</p>
              <p><code className="bg-white px-1 py-0.5 rounded border border-stone-200">&#123;price&#125;</code> = Harga produk</p>
              <p><code className="bg-white px-1 py-0.5 rounded border border-stone-200">&#123;product_url&#125;</code> = Link halaman produk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 3: Warna Tema */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="font-serif text-lg font-normal text-stone-900">
            3. Palet Warna Aksen Butik
          </h2>
          <p className="text-xs text-stone-500">
            Pilih warna aksen khas untuk tombol, highlight, dan aksen estetika website Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themePresets.map((theme) => {
            const isSelected = formData.themeColor === theme.id;

            return (
              <button
                type="button"
                key={theme.id}
                onClick={() => setFormData({ ...formData, themeColor: theme.id })}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? "border-stone-900 bg-stone-50 ring-2 ring-stone-900/10"
                    : "border-stone-200 hover:border-stone-400 bg-white"
                }`}
              >
                <span
                  className="h-6 w-6 rounded-full shrink-0 mt-0.5 shadow-xs"
                  style={{ backgroundColor: theme.color }}
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-stone-900">{theme.name}</p>
                  <p className="text-[11px] text-stone-500 leading-tight">{theme.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bagian 4: Kontak & Jam Operasional */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="font-serif text-lg font-normal text-stone-900">
            4. Informasi Kontak & Sosial Media
          </h2>
          <p className="text-xs text-stone-500">
            Ditampilkan di footer dan halaman kontak.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Akun Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
              placeholder="@nadhirah.store atau link lengkap"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Akun TikTok
            </label>
            <input
              type="text"
              value={formData.tiktok}
              onChange={(e) =>
                setFormData({ ...formData, tiktok: e.target.value })
              }
              placeholder="@nadhirahstore"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Alamat Butik / Toko Fisik
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Contoh: Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Jam Operasional
            </label>
            <input
              type="text"
              value={formData.operationalHours}
              onChange={(e) =>
                setFormData({ ...formData, operationalHours: e.target.value })
              }
              placeholder="Contoh: Senin - Sabtu: 09.00 - 18.00 WIB"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800"
            />
          </div>
        </div>
      </div>

      {/* Submit Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}</span>
        </button>
      </div>
    </form>
  );
}
