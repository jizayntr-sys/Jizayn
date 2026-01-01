'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errorPage');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mb-6">{t('description')}</p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-4">{t('errorCode')}: {error.digest}</p>
        )}
        {error.message && process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            {t('retry')}
          </button>
          <Link
            href="/"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}