import { loginAction } from "../actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm w-full">
        <h1 className="text-xl font-bold mb-1">Admin Girişi</h1>
        <p className="text-sm text-gray-500 mb-6">en-ucuz yönetim paneli</p>

        {searchParams.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            Kullanıcı adı veya şifre hatalı.
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
