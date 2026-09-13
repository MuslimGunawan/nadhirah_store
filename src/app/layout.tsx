import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getStoreSettings } from "@/lib/store";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return {
    title: {
      default: `${settings.storeName} — ${settings.tagline}`,
      template: `%s | ${settings.storeName}`,
    },
    description: settings.tagline,
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <html
      lang="id"
      data-theme={settings.themeColor || "rose"}
      className={`${playfair.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased selection:bg-[var(--accent)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
