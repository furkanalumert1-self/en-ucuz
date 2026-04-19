import Link from "next/link";

export default function BasariliPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-xl font-bold mb-2">Rezervasyon Alındı!</h1>
        <p className="text-sm text-gray-500 mb-6">
          Talebiniz restoran tarafından inceleniyor. Onay için sizi arayacaklar.
        </p>
        <Link
          href="/"
          className="block w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/menu"
          className="block w-full mt-2 text-sm text-gray-500 underline"
        >
          Menüyü İncele
        </Link>
      </div>
    </div>
  );
}
