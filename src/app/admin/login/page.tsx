"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk, periksa email atau kata sandi Anda");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan, silakan coba lagi");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 px-4">
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Halaman Toko</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-full bg-stone-100 text-stone-800 mb-1">
            <ShieldCheck className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="font-serif text-2xl font-normal text-stone-900">
            Masuk Pengelola Toko
          </h1>
          <p className="text-xs text-stone-500">
            Akses dashboard manajemen Nadhirah Store
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Pengelola
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sedang Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
