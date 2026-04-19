import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { approveReservation, rejectReservation, logoutAction } from "../actions";

async function getReservations() {
  return prisma.reservation.findMany({
    include: { table: { include: { restaurant: true } } },
    orderBy: { createdAt: "desc" },
  });
}

const statusLabel: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Bekliyor", cls: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Onaylandı", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Reddedildi", cls: "bg-red-100 text-red-600" },
};

export default async function ReservasyonlarPage() {
  const isAdmin = await getSession();
  if (!isAdmin) redirect("/admin/login");

  const reservations = await getReservations();
  const pending = reservations.filter((r) => r.status === "pending");
  const rest = reservations.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-sm">Admin Panel</span>
            <span className="text-xs text-gray-400 ml-2">Rezervasyonlar</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-gray-500 underline">
              Çıkış
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Pending */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Bekleyen
            </h2>
            {pending.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pending.length}
              </span>
            )}
          </div>

          {pending.length === 0 ? (
            <p className="text-sm text-gray-400">Bekleyen rezervasyon yok.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => (
                <ReservationCard key={r.id} r={r} showActions />
              ))}
            </div>
          )}
        </section>

        {/* Others */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Geçmiş
          </h2>
          {rest.length === 0 ? (
            <p className="text-sm text-gray-400">Kayıt yok.</p>
          ) : (
            <div className="space-y-3">
              {rest.map((r) => (
                <ReservationCard key={r.id} r={r} showActions={false} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ReservationCard({
  r,
  showActions,
}: {
  r: Awaited<ReturnType<typeof getReservations>>[number];
  showActions: boolean;
}) {
  const s = statusLabel[r.status] ?? statusLabel.pending;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{r.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
              {s.label}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
            <div>{r.phone}</div>
            <div>
              {r.date} — {r.time} • {r.guestCount} kişi
            </div>
            <div>
              {r.table.restaurant.name} / Masa {r.table.number}
            </div>
            {r.note && <div className="text-gray-400 italic">{r.note}</div>}
          </div>
        </div>

        {showActions && (
          <div className="flex flex-col gap-1 flex-shrink-0">
            <form action={approveReservation.bind(null, r.id)}>
              <button
                type="submit"
                className="w-full text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-medium"
              >
                Onayla
              </button>
            </form>
            <form action={rejectReservation.bind(null, r.id)}>
              <button
                type="submit"
                className="w-full text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium"
              >
                Reddet
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
