"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Share2, Check, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWhatsAppLink, formatPrice } from "@/lib/store";

interface Variant {
  id: number;
  variantName: string;
  stock: number;
}

interface ProductDetailActionProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    status: string;
    variants: Variant[];
  };
  settings: {
    storeName: string;
    whatsappNumber: string;
    waMessageTemplate: string;
  };
}

export default function ProductDetailAction({
  product,
  settings,
}: ProductDetailActionProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants.length === 1 ? product.variants[0].id : null
  );
  const [copied, setCopied] = useState(false);
  const [productUrl, setProductUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProductUrl(window.location.href);
    }
  }, []);

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );

  const isSoldOut = product.status === "sold_out";
  const isPreOrder = product.status === "pre_order";
  const isVariantOutOfStock = selectedVariant && selectedVariant.stock <= 0;

  const currentPrice = product.discountPrice ?? product.price;
  const formattedPrice = formatPrice(currentPrice);

  const canOrder =
    !isSoldOut &&
    (product.variants.length === 0 ||
      (selectedVariantId !== null && !isVariantOutOfStock));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Lihat koleksi ${product.name} di ${settings.storeName}`,
          url: productUrl || window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(productUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch {
      // Ignored
    }
  };

  const waUrl = generateWhatsAppLink({
    whatsappNumber: settings.whatsappNumber,
    template: settings.waMessageTemplate,
    storeName: settings.storeName,
    productName: product.name,
    variant: selectedVariant ? selectedVariant.variantName : "Standar",
    price: formattedPrice,
    productUrl: productUrl || `http://localhost:3000/produk/${product.slug}`,
  });

  return (
    <div className="space-y-6 pt-3 relative">
      {/* Toast Notification for Copied Link */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-stone-900 text-white px-5 py-2.5 shadow-2xl flex items-center gap-2.5 text-xs font-semibold tracking-wide border border-stone-700"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Tautan produk berhasil disalin ke clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variant Selection */}
      {product.variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Pilih Varian (Ukuran / Warna):
            </span>
            {selectedVariant && (
              <span
                className={`font-semibold transition-colors ${
                  selectedVariant.stock <= 0
                    ? "text-rose-600"
                    : selectedVariant.stock <= 3
                    ? "text-amber-600"
                    : "text-emerald-700"
                }`}
              >
                {selectedVariant.stock <= 0
                  ? "Varian Ini Habis"
                  : selectedVariant.stock <= 3
                  ? `Stok Terbatas: Sisa ${selectedVariant.stock} pcs`
                  : `Stok Tersedia (${selectedVariant.stock} pcs)`}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              const isOut = v.stock <= 0;

              return (
                <motion.button
                  key={v.id}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm ring-2 ring-[var(--accent)]/20"
                      : isOut
                      ? "border-[var(--border)] bg-stone-100/70 text-stone-400 line-through opacity-70"
                      : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-stone-400 hover:shadow-2xs"
                  }`}
                >
                  <span>{v.variantName}</span>
                </motion.button>
              );
            })}
          </div>

          {!selectedVariantId && product.variants.length > 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-amber-700 flex items-center gap-1.5 font-medium"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Harap pilih salah satu varian sebelum melanjutkan ke WhatsApp</span>
            </motion.p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {/* Main WhatsApp CTA with spring hover & subtle ripple */}
        <motion.a
          href={canOrder ? waUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canOrder}
          whileHover={canOrder ? { scale: 1.02, y: -2 } : {}}
          whileTap={canOrder ? { scale: 0.98 } : {}}
          className={`flex-1 flex items-center justify-center gap-3 rounded-2xl py-4 px-6 text-sm sm:text-base font-semibold transition-all duration-200 shadow-md ${
            canOrder
              ? "bg-[#25D366] text-white hover:bg-[#20bd5a] hover:shadow-lg cursor-pointer"
              : "bg-stone-200 text-stone-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          <MessageCircle className="h-5 w-5 fill-current shrink-0 animate-bounce sm:animate-none" />
          <span>
            {isSoldOut
              ? "Stok Produk Habis"
              : isPreOrder
              ? "Pesan Pre-Order via WhatsApp"
              : "Pesan via WhatsApp Sekarang"}
          </span>
        </motion.a>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-2xl py-4 px-6 border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-stone-50 hover:border-stone-400 transition-colors text-xs sm:text-sm font-semibold cursor-pointer shadow-2xs"
          title="Salin dan bagikan link produk"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-stone-500" />
              <span>Bagikan</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Trust & Assurance Details */}
      <div className="pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Transaksi Langsung & Terpercaya</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
          <span>Respon Cepat Jam Kerja</span>
        </div>
      </div>
    </div>
  );
}
