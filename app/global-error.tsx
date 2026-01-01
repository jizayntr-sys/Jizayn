'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="tr">
      <body>
        <div className="container mx-auto px-4 py-16 text-center min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4 text-wood-700">Bir Hata Oluştu</h1>
          <p className="text-gray-600 mb-8">
            Üzgünüz, beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 mb-4">Hata Kodu: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="bg-wood-600 text-white px-6 py-3 rounded-lg hover:bg-wood-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}

