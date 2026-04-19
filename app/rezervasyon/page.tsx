import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createReservation } from "./actions";

async function getTables() {
  return prisma.table.findMany({
    include: { restaurant: { select: { name: true } } },
    orderBy: { number: "asc" },
  });
}

export default async function ReservasyonPage({
  searchParams,
}: {
  searchParams: { tableId?: string; tableName?: string };
}) {
  const tables = await getTables();
  const defaultTableId = searchParams.tableId ?? "";

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-lg">
            ←
          </Link>
          <span className="font-bold text-sm">Rezervasyon Yap</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h1 className="text-lg font-bold mb-1">Masa Rezervasyonu</h1>
          <p className="text-sm text-gray-500 mb-6">
            Bilgilerinizi girin, restoran onaylasın.
          </p>

          <form action={createReservation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adınız Soyadınız
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Ahmet Yılmaz"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="0532 123 45 67"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih
                </label>
                <input
                  name="date"
                  type="date"
                  required
                  min={today}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saat
                </label>
                <select
                  name="time"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  {["12:00","12:30","13:00","13:30","14:00","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30"].map(
                    (t) => <option key={t}>{t}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kişi Sayısı
                </label>
                <select
                  name="guestCount"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  {[1,2,3,4,5,6,7,8].map((n) => (
                    <option key={n} value={n}>{n} kişi</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Masa
                </label>
                <select
                  name="tableId"
                  required
                  defaultValue={defaultTableId}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Seç</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Masa {t.number} ({t.capacity} kişi)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Not (isteğe bağlı)
              </label>
              <textarea
                name="note"
                rows={2}
                placeholder="Özel istek veya not..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm mt-2"
            >
              Rezervasyon Talep Et
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Rezervasyonunuz restoran onayından sonra geçerli olur.
        </p>
      </main>
    </div>
  );
}
