"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  imageUrl: string;
  isWatermarked?: boolean;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
  storeName: string;
}

export default function ProductGallery({
  images,
  productName,
  storeName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = images[selectedIndex] || {
    id: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    isWatermarked: false,
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0 pb-2 md:pb-0">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[3/4] w-16 sm:w-20 overflow-hidden rounded-lg border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? "border-[var(--accent)] opacity-100 ring-2 ring-[var(--accent)]/20"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`Lihat foto ${idx + 1}`}
            >
              <Image
                src={img.imageUrl}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted-light)] flex-1">
        <Image
          src={currentImage.imageUrl}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Optional Watermark Overlay */}
        {currentImage.isWatermarked && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rotate-[-25deg] text-xl sm:text-3xl font-serif font-light text-white/40 tracking-widest uppercase select-none drop-shadow-md border border-white/20 px-6 py-2 rounded-lg">
              {storeName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
