"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [progress, setProgress] = useState(0);

  const duration = 6500; // 6.5s per banner

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setProgress(0);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setProgress(0);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalStep = 50;
    const increment = (intervalStep / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [banners.length, nextSlide]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-[#141210] text-white">
      <div className="relative h-[500px] sm:h-[580px] md:h-[640px] w-full">
        {/* Background Image Carousel with smooth crossfade & scale */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 z-10"
          >
            <Image
              src={current.imageUrl}
              alt={current.title || "Banner Nadhirah Store"}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.72]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-stop cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 z-20 pointer-events-none" />

        {/* Content Container with animated typography */}
        <div className="relative z-30 mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-22 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-widest uppercase font-medium text-amber-300">
                <span>Edisi Istimewa</span>
              </div>

              {current.title && (
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-[1.15] drop-shadow-sm">
                  {current.title}
                </h1>
              )}

              {current.subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-stone-200/90 font-light leading-relaxed max-w-xl">
                  {current.subtitle}
                </p>
              )}

              <div className="pt-3 flex items-center gap-4">
                <Link
                  href={current.linkUrl || "/produk"}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white text-stone-900 px-7 py-4 text-xs sm:text-sm font-semibold tracking-wide hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Jelajahi Koleksi</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>

                <a
                  href="#kategori"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/30 hover:border-white text-white px-6 py-4 text-xs sm:text-sm font-medium backdrop-blur-xs hover:bg-white/10 transition-all duration-300"
                >
                  <span>Lihat Kategori</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modern Slide Controls & Progress Bar */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex items-center gap-3">
            {/* Pill Dots */}
            <div className="flex items-center gap-1.5 mr-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgress(0);
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-7 bg-amber-400"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-200 border border-white/10 hover:border-white/30 cursor-pointer active:scale-90"
                aria-label="Banner sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-200 border border-white/10 hover:border-white/30 cursor-pointer active:scale-90"
                aria-label="Banner selanjutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Autoplay Progress Line */}
        {banners.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15 z-30 overflow-hidden">
            <div
              className="h-full bg-amber-400/90 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
