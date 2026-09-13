"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Share2, Check, AlertCircle } from "lucide-react";
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
    status: string; // active | inactive | pre_order | sold_out
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
          text: `Lihat ${product.name} di ${settings.storeName}`,
          url: productUrl || window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard if share was dismissed or cancelled
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(productUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
    <div className="space-y-6 pt-2">
      {/* Variant Selection */}
      {product.variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Pilih Varian (Ukuran / Warna):
            </span>
            {selectedVariant && (
              <span
                className={`font-medium ${
                  selectedVariant.stock <= 0
                    ? "text-rose-600"
                    : selectedVariant.stock <= 3
                    ? "text-amber-600"
                    : "text-emerald-700"
                }`}
              >
                {selectedVariant.stock <= 0
                  ? "Stok Habis"
                  : selectedVariant.stock <= 3
                  ? `Tersisa ${selectedVariant.stock} pcs`
                  : "Stok Tersedia"}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              const isOut = v.stock <= 0;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-xs"
                      : isOut
                      ? "border-[var(--border)] bg-[var(--muted-light)] text-[var(--muted)] opacity-60 hover:opacity-100"
                      : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--accent)]"
                  }`}
                >
                  <span>{v.variantName}</span>
                  {isOut && <span className="ml-1 text-[10px] text-rose-500">(Habis)</span>}
                </button>
              );
            })}
          </div>

          {!selectedVariantId && product.variants.length > 1 && (
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Harap pilih salah satu varian sebelum memesan</span>
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* Main WhatsApp CTA */}
        <a
          href={canOrder ? waUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canOrder}
          className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl py-4 px-6 text-sm sm:text-base font-semibold transition-all duration-200 shadow-xs ${
            canOrder
              ? "bg-[#25D366] text-white hover:bg-[#20bd5a] hover:shadow-md cursor-pointer transform hover:-translate-y-0.5"
              : "bg-stone-200 text-stone-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          <MessageCircle className="h-5 w-5 fill-current shrink-0" />
          <span>
            {isSoldOut
              ? "Stok Produk Habis"
              : isPreOrder
              ? "Pre-Order via WhatsApp"
              : "Pesan via WhatsApp"}
          </span>
        </a>

        {/* Share / Copy Link Button */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-xl py-4 px-5 border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--muted-light)] hover:border-stone-400 transition-colors text-sm font-medium cursor-pointer"
          title="Salin link produk"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700">Link Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-[var(--muted)]" />
              <span>Bagikan</span>
            </>
          )}
        </button>
      </div>

      {/* Customer Assurance Info */}
      <div className="pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Transaksi Langsung & Aman</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
          <span>Respon Cepat Jam Kerja</span>
        </div>
      </div>
    </div>
  );
}
