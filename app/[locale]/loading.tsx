import { useTranslations } from 'next-intl';

export default function Loading() {
  // Note: useTranslations doesn't work in loading.tsx
  // This is a server component, so we'll use a simple loading UI
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-600 mb-4"></div>
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    </div>
  );
}

