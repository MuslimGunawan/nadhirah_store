"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/store";

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  status: string; // active | inactive | pre_order | sold_out
  isFeatured?: boolean;
  category?: {
    name: string;
    slug: string;
  };
  images: {
    imageUrl: string;
  }[];
}

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage =
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

  const isSoldOut = product.status === "sold_out";
  const isPreOrder = product.status === "pre_order";
  const hasDiscount =
    product.discountPrice !== null && product.discountPrice < product.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/produk/${product.slug}`}
        className="group flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition-all duration-300 hover:border-stone-400/80 hover:shadow-md active:scale-[0.99]"
      >
        {/* Product Image Container (3:4 ratio) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--muted-light)]">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
          />

          {/* Badges Container */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isSoldOut && (
              <span className="inline-block rounded-md bg-stone-900/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-xs uppercase shadow-xs">
                Habis
              </span>
            )}

            {isPreOrder && (
              <span className="inline-block rounded-md bg-amber-700/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-xs uppercase shadow-xs">
                Pre-Order
              </span>
            )}

            {!isSoldOut && hasDiscount && (
              <span className="inline-block rounded-md bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase shadow-xs">
                Hemat {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
              </span>
            )}

            {product.isFeatured && !isSoldOut && !isPreOrder && (
              <span className="inline-block rounded-md bg-[#1C1917]/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-xs uppercase shadow-xs">
                Koleksi Pilihan
              </span>
            )}
          </div>

          {/* Hover Quick Action Cue (Desktop) */}
          <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 hidden sm:block">
            <span className="h-8 w-8 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-md backdrop-blur-xs">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            {product.category && (
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                {product.category.name}
              </p>
            )}

            <h3 className="font-serif text-sm sm:text-base font-normal text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1 border-t border-[var(--border)]/60">
            {hasDiscount ? (
              <>
                <span className="text-sm sm:text-base font-semibold text-[var(--accent)]">
                  {formatPrice(product.discountPrice!)}
                </span>
                <span className="text-xs text-[var(--muted)] line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-semibold text-[var(--foreground)]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
