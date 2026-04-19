import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "En Ucuz | Şeffaf Menü Platformu",
  description: "Restoranların menü fiyatlarını karşılaştır, en uygun yeri bul.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
