import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { submitPrice } from "./actions";

const locationTypes = ["bar", "kafe", "büfe", "market", "restoran", "lokanta", "çay ocağı", "simitçi", "fırın", "akaryakıt", "diğer"];

const cities = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
  "Gaziantep", "Mersin", "Diyarbakır", "Kayseri", "Eskişehir", "Trabzon",
  "Samsun", "Malatya", "Denizli", "Erzurum", "Van", "Balıkesir", "Manisa",
];

async function getItems() {
  return prisma.item.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { name: "asc" }],
  });
}

export default async function FiyatBildirPage({
  searchParams,
}: {
  searchParams: { itemId?: string };
}) {
  const items = await getItems();
  const defaultItemId = searchParams.itemId ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 text-lg">←</Link>
          <span className="font-bold text-sm">Fiyat Bildir</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h1 className="text-lg font-bold mb-1">Fiyat Bildir</h1>
          <p className="text-sm text-gray-500 mb-6">
            Gittiğin mekandaki fiyatı paylaş. Admin onayından sonra yayına girer.
          </p>

          <form action={submitPrice} className="space-y-4">
            {/* Item */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün</label>
              <select
                name="itemId"
                required
                defaultValue={defaultItemId}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="">Seç...</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.category.icon} {item.name} ({item.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="Örn: 45.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <hr className="border-gray-100" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mekan Bilgisi</p>

            {/* Location name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mekan Adı</label>
              <input
                name="locationName"
                type="text"
                required
                placeholder="Örn: Tarihi Çay Ocağı"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* City + District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                <select
                  name="city"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Seç...</option>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                <input
                  name="district"
                  type="text"
                  required
                  placeholder="Örn: Kadıköy"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mekan Türü</label>
              <select
                name="type"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="">Seç...</option>
                {locationTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm mt-2"
            >
              Fiyatı Gönder
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Gönderdiğin fiyat admin onayından sonra yayına girer.
        </p>
      </main>
    </div>
  );
}
