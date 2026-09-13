import Link from "next/link";
import Image from "next/image";
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
    <Link
      href={`/produk/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-white transition-all duration-300 hover:border-[var(--accent-border)] hover:shadow-xs"
    >
      {/* Product Image Container (3:4 portrait ratio for fashion) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--muted-light)]">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isSoldOut && (
            <span className="inline-block rounded-md bg-stone-900/80 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-xs">
              Habis
            </span>
          )}

          {isPreOrder && (
            <span className="inline-block rounded-md bg-amber-700/80 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-xs">
              Pre-Order
            </span>
          )}

          {!isSoldOut && hasDiscount && (
            <span className="inline-block rounded-md bg-[var(--accent)] px-2 py-0.5 text-[11px] font-medium tracking-wide text-white">
              Hemat {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
            </span>
          )}

          {product.isFeatured && !isSoldOut && !isPreOrder && (
            <span className="inline-block rounded-md bg-stone-800 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white">
              Pilihan
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 space-y-1.5">
        {product.category && (
          <p className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-medium">
            {product.category.name}
          </p>
        )}

        <h3 className="text-sm sm:text-base font-normal text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-0.5">
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
  );
}
