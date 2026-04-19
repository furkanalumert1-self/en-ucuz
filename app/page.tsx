import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 300;

async function getData() {
  const categories = await prisma.category.findMany({
    include: { items: { select: { id: true } } },
    orderBy: { id: "asc" },
  });

  const items = await prisma.item.findMany({
    include: {
      category: true,
      priceReports: {
        where: { status: "approved" },
        orderBy: { price: "asc" },
        take: 3,
        include: { location: true },
      },
    },
  });

  return { categories, items };
}

export default async function HomePage() {
  const { categories, items } = await getData();

  const itemsWithPrices = items
    .filter((i) => i.priceReports.length > 0)
    .map((i) => ({
      ...i,
      minPrice: i.priceReports[0].price,
      minLocation: i.priceReports[0].location,
      reportCount: i.priceReports.length,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-base">🔍 en-ucuz.tr</span>
            <span className="text-xs text-gray-400 ml-2 hidden sm:inline">{"Türkiye'de en ucuz nerede?"}</span>
          </div>
          <Link
            href="/fiyat-bildir"
            className="text-xs bg-orange-500 text-white px-3 py-2 rounded-lg font-medium"
          >
            + Fiyat Bildir
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-orange-500 text-white px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">{"Türkiye'de En Ucuz Nerede?"}</h1>
        <p className="text-orange-100 text-sm max-w-md mx-auto">
          Mekanlar listede üst sıraya çıkmak için fiyatlarını düşürüyor.
          Fiyatları sen bildiriyorsun, rekabet seni kazandırıyor.
        </p>
      </section>

      {/* Categories */}
      <section className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Link
            href="/"
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-orange-500 text-white font-medium"
          >
            Tümü
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/kategori/${c.slug}`}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 font-medium"
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Item list */}
      <main className="max-w-2xl mx-auto px-4 py-4 pb-12 space-y-3">
        {itemsWithPrices.map((item) => (
          <Link
            key={item.id}
            href={`/urun/${item.id}`}
            className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-orange-200"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">{item.category.icon}</span>
                  <span className="font-semibold text-sm">{item.name}</span>
                  <span className="text-xs text-gray-400">{item.unit}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  En ucuz:{" "}
                  <span className="font-medium text-gray-700">
                    {item.minLocation.name}
                  </span>{" "}
                  — {item.minLocation.city}, {item.minLocation.district}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {item.reportCount} fiyat kaydı
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-green-600">
                  {formatPrice(item.minPrice)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">en düşük</div>
              </div>
            </div>
          </Link>
        ))}
      </main>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-12">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
          <p className="text-sm font-medium text-orange-800 mb-3">
            Bilmediğimiz bir fiyat mı var?
          </p>
          <Link
            href="/fiyat-bildir"
            className="inline-block bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Fiyat Bildir
          </Link>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-8">
        en-ucuz.tr — Topluluk destekli fiyat şeffaflığı
      </footer>
    </div>
  );
}
