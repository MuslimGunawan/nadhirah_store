import { prisma } from "./prisma";

export interface FormattedSettings {
  id: number;
  storeName: string;
  logoUrl: string | null;
  tagline: string;
  whatsappNumber: string;
  waMessageTemplate: string;
  themeColor: string;
  socialLinks: Record<string, string>;
  address: string;
  operationalHours: string;
}

export async function getStoreSettings(): Promise<FormattedSettings> {
  try {
    const settings = await prisma.storeSettings.findFirst({
      where: { id: 1 },
    });

    let socialLinks: Record<string, string> = {};
    if (settings?.socialLinks) {
      try {
        socialLinks = JSON.parse(settings.socialLinks);
      } catch {
        socialLinks = {};
      }
    }

    return {
      id: settings?.id ?? 1,
      storeName: settings?.storeName ?? "Nadhirah Store",
      logoUrl: settings?.logoUrl ?? null,
      tagline: settings?.tagline ?? "Koleksi Busana Muslimah Elegan & Bersahaja",
      whatsappNumber: settings?.whatsappNumber ?? "6281298765432",
      waMessageTemplate:
        settings?.waMessageTemplate ??
        `Halo Kak {store_name}, saya mau tanya/pesan produk ini:\n- Nama Produk: {product_name}\n- Varian: {variant}\n- Harga: {price}\n- Link: {product_url}\n\nApakah stok masih tersedia kak?`,
      themeColor: settings?.themeColor ?? "rose",
      socialLinks,
      address: settings?.address ?? "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan",
      operationalHours: settings?.operationalHours ?? "Senin - Sabtu: 09.00 - 18.00 WIB",
    };
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return {
      id: 1,
      storeName: "Nadhirah Store",
      logoUrl: null,
      tagline: "Koleksi Busana Muslimah Elegan & Bersahaja",
      whatsappNumber: "6281298765432",
      waMessageTemplate: `Halo Kak {store_name}, saya mau tanya/pesan produk ini:\n- Nama Produk: {product_name}\n- Varian: {variant}\n- Harga: {price}\n- Link: {product_url}\n\nApakah stok masih tersedia?`,
      themeColor: "rose",
      socialLinks: {},
      address: "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan",
      operationalHours: "Senin - Sabtu: 09.00 - 18.00 WIB",
    };
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppLink({
  whatsappNumber,
  template,
  storeName,
  productName,
  variant,
  price,
  productUrl,
}: {
  whatsappNumber: string;
  template: string;
  storeName: string;
  productName: string;
  variant: string;
  price: string;
  productUrl: string;
}): string {
  const phone = cleanPhoneNumber(whatsappNumber);
  const message = template
    .replace(/{store_name}/g, storeName)
    .replace(/{product_name}/g, productName)
    .replace(/{variant}/g, variant || "Standar")
    .replace(/{price}/g, price)
    .replace(/{product_url}/g, productUrl);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
