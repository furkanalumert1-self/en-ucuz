import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

async function getTableWithMenu(tableId: number) {
  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: {
      restaurant: {
        include: {
          menuItems: {
            where: { available: true },
            orderBy: { price: "asc" },
          },
        },
      },
    },
  });
  return table;
}

export default async function QRMenuPage({ params }: { params: { tableId: string } }) {
  const tableId = parseInt(params.tableId);
  if (isNaN(tableId)) notFound();

  const table = await getTableWithMenu(tableId);
  if (!table) notFound();

  const { restaurant } = table;

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
      <header className="bg-orange-500 text-white px-4 pt-8 pb-6 text-center">
        <div className="text-xs font-medium opacity-75 mb-1">
          Masa {table.number} • {table.capacity} Kişilik
        </div>
        <h1 className="text-xl font-bold">{restaurant.name}</h1>
        <p className="text-orange-100 text-xs mt-1">{restaurant.address}</p>
      </header>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="px-4 flex gap-2 py-2">
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

      {/* Menu */}
      <main className="px-4 pb-28 pt-4 space-y-8">
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
                  <div className="flex items-center gap-2 min-w-0">
                    {idx === 0 && (
                      <span className="text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                        EN UCUZ
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400">{item.description}</div>
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

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Link
          href={`/rezervasyon?tableId=${table.id}&tableName=Masa ${table.number}`}
          className="block w-full bg-orange-500 text-white text-center font-semibold py-3 rounded-xl text-sm"
        >
          Bu Masayı Rezerve Et
        </Link>
        <div className="text-center text-xs text-gray-400 mt-2">
          {restaurant.phone}
        </div>
      </div>
    </div>
  );
}
