'use client';

import { useTranslations } from 'next-intl';
import { ShoppingBag, ExternalLink } from 'lucide-react';

interface AddToCartButtonProps {
  url: string;
  platform?: string;
}

export default function AddToCartButton({ url, platform = 'Shopier' }: AddToCartButtonProps) {
  const t = useTranslations('product');

  // Platforma göre renk şemaları
  const platformColors: Record<string, string> = {
    Shopier: 'bg-indigo-600 hover:bg-indigo-700',
    Etsy: 'bg-orange-600 hover:bg-orange-700',
    Amazon: 'bg-slate-800 hover:bg-slate-900',
    WhatsApp: 'bg-green-600 hover:bg-green-700',
  };

  const colorClass = platformColors[platform] || platformColors['Shopier'];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        relative w-full md:w-auto min-w-[200px] px-8 py-4 rounded-full font-bold text-white transition-all duration-300 ease-out
        transform active:scale-95 hover:shadow-lg overflow-hidden
        ${colorClass} flex items-center justify-center gap-2 group inline-flex
      `}
    >
      <ShoppingBag className="w-5 h-5" />
      <span>{platform} {t('buyWith')}</span>
      <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}