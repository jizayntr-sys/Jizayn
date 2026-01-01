import Link from 'next/link';

// Global 404 sayfası: Geçersiz bir dil kodu girildiğinde veya kök dizinde eşleşmeyen bir rota olduğunda çalışır.
// Bu dosya app/layout.tsx tarafından sarmalanır ancak next-intl bağlamı dışındadır.
export default function GlobalNotFound() {
  return (
    <html lang="tr">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
        <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-9xl font-black text-gray-200 select-none mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Sayfa Bulunamadı</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Aradığınız sayfa mevcut değil veya desteklenmeyen bir dil kodu kullandınız.
          </p>
          <Link
            href="/"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </body>
    </html>
  );
}