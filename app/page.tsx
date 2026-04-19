import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

async function getRestaurants() {
  return prisma.restaurant.findMany({
    include: {
      menuItems: { where: { available: true } },
    },
    orderBy: { name: "asc" },
  });
}

function avgPrice(prices: number[]) {
  if (!prices.length) return 0;
  return prices.reduce((a, b) => a + b, 0) / prices.length;
}

export default async function HomePage() {
  const restaurants = await getRestaurants();

  const ranked = restaurants
    .map((r) => ({
      ...r,
      avg: avgPrice(r.menuItems.map((m) => m.price)),
      min: Math.min(...r.menuItems.map((m) => m.price)),
    }))
    .sort((a, b) => a.avg - b.avg);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">en-ucuz.tr</span>
          <Link
            href="/rezervasyon"
            className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg font-medium"
          >
            Rezervasyon Yap
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-orange-500 text-white px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Şeffaf Menü Fiyatları</h1>
        <p className="text-orange-100 text-base mb-6">
          Restoranlar listede üst sırada çıkmak için fiyatlarını düşürüyor. Kazanan sen.
        </p>
        <Link
          href="/menu"
          className="inline-block bg-white text-orange-600 font-semibold px-6 py-3 rounded-xl text-sm"
        >
          Menüyü Gör →
        </Link>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Nasıl Çalışır?
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📋", title: "Listele", desc: "Tüm menü fiyatları açık" },
            { icon: "📉", title: "Rekabet", desc: "Ucuz olan üst sıraya çıkar" },
            { icon: "🏆", title: "Kazan", desc: "En uygun fiyatı seç" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="font-semibold text-sm">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Rankings */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Fiyat Sıralaması
        </h2>
        <div className="space-y-3">
          {ranked.map((r, i) => (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  i === 0
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{r.name}</div>
                <div className="text-xs text-gray-500 truncate">{r.address}</div>
                <div className="text-xs text-gray-400 mt-0.5">{r.phone}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-orange-600">
                  ort. {formatPrice(r.avg)}
                </div>
                <div className="text-xs text-green-600">
                  min {formatPrice(r.min)}
                </div>
                <Link
                  href="/menu"
                  className="text-xs text-blue-600 underline mt-1 block"
                >
                  Menüyü Gör
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-8">
        en-ucuz.tr — Fiyat şeffaflığı için
      </footer>
    </div>
  );
}
