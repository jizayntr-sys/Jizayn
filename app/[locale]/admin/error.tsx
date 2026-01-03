'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in production
    console.error('Admin dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bir Hata Oluştu
          </h2>
          <p className="text-gray-600 mb-6">
            Admin panelinde bir sorun oluştu. Lütfen tekrar deneyin.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-left">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <a
              href="/tr"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Ana Sayfaya Dön
            </a>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Sorun devam ederse:</p>
            <ul className="mt-2 space-y-1 text-left list-disc list-inside">
              <li>Veritabanı bağlantısını kontrol edin</li>
              <li>Environment variables doğru girilmiş mi kontrol edin</li>
              <li>Vercel function logs&apos;unu inceleyin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
