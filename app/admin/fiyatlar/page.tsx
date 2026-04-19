import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { approveReport, rejectReport, logoutAction } from "../actions";

async function getReports() {
  return prisma.priceReport.findMany({
    include: { item: { include: { category: true } }, location: true },
    orderBy: { reportedAt: "desc" },
  });
}

export default async function AdminFiyatlarPage() {
  const isAdmin = await getSession();
  if (!isAdmin) redirect("/admin/login");

  const reports = await getReports();
  const pending = reports.filter((r) => r.status === "pending");
  const history = reports.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-sm">Admin</span>
            <span className="text-xs text-gray-400 ml-2">Fiyat Raporları</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{pending.length} bekliyor</span>
            <form action={logoutAction}>
              <button type="submit" className="text-xs text-gray-500 underline">Çıkış</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bekleyen</h2>
            {pending.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
            )}
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-400">Bekleyen rapor yok.</p>
          ) : (
            <div className="space-y-2">
              {pending.map((r) => <ReportCard key={r.id} r={r} showActions />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Geçmiş</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-400">Kayıt yok.</p>
          ) : (
            <div className="space-y-2">
              {history.map((r) => <ReportCard key={r.id} r={r} showActions={false} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ReportCard({
  r,
  showActions,
}: {
  r: Awaited<ReturnType<typeof getReports>>[number];
  showActions: boolean;
}) {
  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };
  const statusLabels: Record<string, string> = {
    pending: "Bekliyor",
    approved: "Onaylandı",
    rejected: "Reddedildi",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-sm">
              {r.item.category.icon} {r.item.name}
            </span>
            <span className="font-bold text-orange-600">{formatPrice(r.price)}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[r.status]}`}>
              {statusLabels[r.status]}
            </span>
          </div>
          <div className="text-xs text-gray-500 space-y-0.5">
            <div className="font-medium">{r.location.name}</div>
            <div>{r.location.city}, {r.location.district} • {r.location.type}</div>
            <div className="text-gray-400">
              {new Date(r.reportedAt).toLocaleDateString("tr-TR", {
                day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex flex-col gap-1 flex-shrink-0">
            <form action={approveReport.bind(null, r.id)}>
              <button type="submit" className="w-full text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-medium">
                Onayla
              </button>
            </form>
            <form action={rejectReport.bind(null, r.id)}>
              <button type="submit" className="w-full text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium">
                Reddet
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
