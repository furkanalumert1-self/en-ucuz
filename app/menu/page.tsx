import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

async function getMenu() {
  const restaurant = await prisma.restaurant.findFirst({
    include: {
      menuItems: {
        where: { available: true },
        orderBy: { price: "asc" },
      },
    },
  });
  return restaurant;
}

export default async function MenuPage() {
  const restaurant = await getMenu();
  if (!restaurant) return <p className="p-8 text-center">Menü bulunamadı.</p>;

  const grouped = restaurant.menuItems.reduce<Record<string, typeof restaurant.menuItems>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const categoryOrder = ["Çorba", "Ana Yemek", "Salata", "Tatlı", "İçecek"];
  const categories = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-lg">
            ←
          </Link>
          <div className="flex-1">
            <div className="font-bold text-sm">{restaurant.name}</div>
            <div className="text-xs text-gray-500">{restaurant.address}</div>
          </div>
          <Link
            href="/rezervasyon"
            className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium flex-shrink-0"
          >
            Rezervasyon
          </Link>
        </div>
      </header>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-2xl mx-auto px-4 flex gap-2 py-2">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium"
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Menu items by category */}
      <main className="max-w-2xl mx-auto px-4 pb-12 pt-4 space-y-8">
        {categories.map((cat) => (
          <section key={cat} id={cat}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {cat}
            </h2>
            <div className="space-y-2">
              {grouped[cat].map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {idx === 0 && (
                      <span className="text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                        EN UCUZ
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400 truncate">{item.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-orange-600 text-sm flex-shrink-0">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
