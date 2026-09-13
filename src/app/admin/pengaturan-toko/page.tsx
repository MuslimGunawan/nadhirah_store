import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStoreSettings } from "@/lib/store";
import StoreSettingsForm from "@/components/admin/StoreSettingsForm";

export const dynamic = "force-dynamic";

export default async function StoreSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
          Pengaturan Profil Toko
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Ubah nama toko, nomor WhatsApp transaksi, template pesan otomatis, dan warna tema kapan saja tanpa coding.
        </p>
      </div>

      <StoreSettingsForm initialSettings={settings} />
    </div>
  );
}
