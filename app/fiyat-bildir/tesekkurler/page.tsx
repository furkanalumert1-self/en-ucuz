import Link from "next/link";

export default function TesekkurlerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🙏</div>
        <h1 className="text-xl font-bold mb-2">Teşekkürler!</h1>
        <p className="text-sm text-gray-500 mb-6">
          Fiyatın alındı. Admin onayından sonra sıralamada görünecek.
          Katkılarınla fiyatlar düşüyor!
        </p>
        <Link href="/" className="block w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm">
          Ana Sayfaya Dön
        </Link>
        <Link href="/fiyat-bildir" className="block w-full mt-2 text-sm text-gray-500 underline">
          Başka Fiyat Bildir
        </Link>
      </div>
    </div>
  );
}
