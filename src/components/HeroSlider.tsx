"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BannerItem {
  id: number;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
}

interface HeroSliderProps {
  banners: BannerItem[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-stone-900 text-white">
      {/* Background Image with subtle zoom */}
      <div className="relative h-[460px] sm:h-[540px] md:h-[600px] w-full">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={b.imageUrl}
              alt={b.title || "Banner Nadhirah Store"}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center brightness-[0.75]"
            />
          </div>
        ))}

        {/* Gradient Overlay for high text contrast without muddy radial colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 z-20" />

        {/* Content Container */}
        <div className="relative z-30 mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 max-w-2xl">
          {current.title && (
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight animate-in fade-in slide-in-from-bottom-3 duration-500">
              {current.title}
            </h1>
          )}

          {current.subtitle && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-stone-200 font-light leading-relaxed max-w-xl">
              {current.subtitle}
            </p>
          )}

          <div className="mt-6 sm:mt-8 flex items-center gap-4">
            <Link
              href={current.linkUrl || "/produk"}
              className="inline-flex items-center gap-2 rounded-full bg-white text-stone-900 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide hover:bg-[var(--accent)] hover:text-white transition-all shadow-md group"
            >
              <span>Jelajahi Koleksi</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Slider Controls (if more than 1 banner) */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + banners.length) % banners.length
                )
              }
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
              aria-label="Banner sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % banners.length)
              }
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
              aria-label="Banner selanjutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
