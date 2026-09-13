"use client";

import { MessageCircle } from "lucide-react";
import { cleanPhoneNumber } from "@/lib/store";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  storeName: string;
}

export default function FloatingWhatsApp({
  whatsappNumber,
  storeName,
}: FloatingWhatsAppProps) {
  const phone = cleanPhoneNumber(whatsappNumber);
  const text = encodeURIComponent(
    `Halo Kak ${storeName}, saya ingin bertanya perihal produk yang tersedia.`
  );

  return (
    <aside aria-label="WhatsApp Floating Action Button" className="fixed bottom-6 right-6 z-40">
      <a
        href={`https://wa.me/${phone}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-lg hover:bg-[#20bd5a] hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Tanya kami di WhatsApp"
      >
        <MessageCircle className="h-5 w-5 fill-current" />
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide">
          Chat WhatsApp
        </span>
      </a>
    </aside>
  );
}
