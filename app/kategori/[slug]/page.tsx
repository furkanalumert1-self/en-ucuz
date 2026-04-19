import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getData(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      items: {
        include: {
          priceReports: {
            where: { status: "approved" },
            orderBy: { price: "asc" },
            take: 1,
            include: { location: true },
          },
        },
      },
    },
  });
  const allCategories = await prisma.category.findMany({ orderBy: { id: "asc" } });
  return { category, allCategories };
}

export default async function KategoriPage({ params }: { params: { slug: string } }) {
  const { category, allCategories } = await getData(params.slug);
  if (!category) notFound();

  const items = category.items
    .filter((i) => i.priceReports.length > 0)
    .map((i) => ({ ...i, minPrice: i.priceReports[0].price, minLocation: i.priceReports[0].location }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-gray-400 text-lg">←</Link>
            <span className="font-bold text-sm">{category.icon} {category.name}</span>
          </div>
          <Link href="/fiyat-bildir" className="text-xs bg-orange-500 text-white px-3 py-2 rounded-lg font-medium">
            + Fiyat Bildir
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link href="/" className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 font-medium">
            Tümü
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c.id}
              href={`/kategori/${c.slug}`}
              className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-full font-medium ${
                c.slug === params.slug
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-12 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">Bu kategoride henüz fiyat yok.</p>
        )}
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/urun/${item.id}`}
            className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-orange-200"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-gray-400">{item.unit}</div>
                <div className="mt-1 text-xs text-gray-500">
                  En ucuz: <span className="font-medium text-gray-700">{item.minLocation.name}</span>{" "}
                  — {item.minLocation.city}, {item.minLocation.district}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-green-600">{formatPrice(item.minPrice)}</div>
                <div className="text-xs text-gray-400">en düşük</div>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
