import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 300;

async function getData(id: number) {
  return prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      priceReports: {
        where: { status: "approved" },
        orderBy: { price: "asc" },
        include: { location: true },
      },
    },
  });
}

export default async function UrunPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const item = await getData(id);
  if (!item) notFound();

  const reports = item.priceReports;
  if (reports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Henüz fiyat kaydı yok.</p>
          <Link href={`/fiyat-bildir?itemId=${id}`} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            İlk Fiyatı Sen Bildir
          </Link>
        </div>
      </div>
    );
  }

  const minPrice = reports[0].price;
  const maxPrice = reports[reports.length - 1].price;
  const avgPrice = reports.reduce((s, r) => s + r.price, 0) / reports.length;

  // Group by city
  const cities = Array.from(new Set(reports.map((r) => r.location.city)));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 text-lg">←</Link>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">{item.name}</div>
            <div className="text-xs text-gray-400">{item.unit} • {item.category.name}</div>
          </div>
          <Link
            href={`/fiyat-bildir?itemId=${id}`}
            className="text-xs bg-orange-500 text-white px-3 py-2 rounded-lg font-medium flex-shrink-0"
          >
            + Fiyat Ekle
          </Link>
        </div>
      </header>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{formatPrice(minPrice)}</div>
            <div className="text-xs text-gray-400">en düşük</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-700">{formatPrice(avgPrice)}</div>
            <div className="text-xs text-gray-400">ortalama</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-500">{formatPrice(maxPrice)}</div>
            <div className="text-xs text-gray-400">en yüksek</div>
          </div>
        </div>
      </section>

      {/* Price bar chart */}
      <section className="max-w-2xl mx-auto px-4 pt-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {reports.length} mekan • fiyat sıralaması
        </h2>
        <div className="space-y-2">
          {reports.map((r, i) => {
            const barPct = maxPrice === minPrice ? 100 : ((r.price - minPrice) / (maxPrice - minPrice)) * 100;
            const isMin = i === 0;
            const isMax = i === reports.length - 1;
            return (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isMin ? "bg-green-100 text-green-700" : isMax ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{r.location.name}</div>
                      <div className="text-xs text-gray-400">{r.location.city}, {r.location.district} • {r.location.type}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className={`font-bold text-sm ${isMin ? "text-green-600" : isMax ? "text-red-500" : "text-gray-700"}`}>
                      {formatPrice(r.price)}
                    </div>
                    {isMin && <div className="text-xs text-green-500">EN UCUZ</div>}
                    {isMax && <div className="text-xs text-red-400">EN PAHALI</div>}
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isMin ? "bg-green-400" : isMax ? "bg-red-400" : "bg-orange-300"}`}
                    style={{ width: `${Math.max(5, barPct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* City breakdown */}
      {cities.length > 1 && (
        <section className="max-w-2xl mx-auto px-4 pt-6 pb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Şehre Göre</h2>
          <div className="grid grid-cols-2 gap-2">
            {cities.map((city) => {
              const cityReports = reports.filter((r) => r.location.city === city);
              const cityMin = Math.min(...cityReports.map((r) => r.price));
              return (
                <div key={city} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="font-medium text-sm">{city}</div>
                  <div className="text-xs text-gray-400">{cityReports.length} mekan</div>
                  <div className="text-base font-bold text-green-600 mt-1">{formatPrice(cityMin)}</div>
                  <div className="text-xs text-gray-400">en düşük</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="max-w-2xl mx-auto px-4 pb-12">
        <Link
          href={`/fiyat-bildir?itemId=${id}`}
          className="block w-full bg-orange-500 text-white text-center font-semibold py-3 rounded-xl text-sm"
        >
          Bu Ürün İçin Fiyat Bildir
        </Link>
      </div>
    </div>
  );
}
