'use client';

import { useTranslations } from 'next-intl';
import { ShoppingBag, ExternalLink } from 'lucide-react';

interface AddToCartButtonProps {
  url: string;
  platform?: string;
}

export default function AddToCartButton({ url, platform = 'Shopier' }: AddToCartButtonProps) {
  const t = useTranslations('product');

  // Platforma göre renk şemaları - Modern gradyanlar ve güçlü gölgeler
  const platformColors: Record<string, string> = {
    Shopier: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl',
    Etsy: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl',
    Amazon: 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-lg hover:shadow-xl',
    WhatsApp: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl',
  };

  // Platform ikonları
  const platformIcons: Record<string, JSX.Element> = {
    Shopier: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H3V7h18v10zm-9-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
    ),
    Etsy: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.5 6.5h9v1h-9v-1zm0 3h9v1h-9v-1zm0 3h9v1h-9v-1zm-3-9C3.12 3.5 2 4.62 2 6v12c0 1.38 1.12 2.5 2.5 2.5h15c1.38 0 2.5-1.12 2.5-2.5V6c0-1.38-1.12-2.5-2.5-2.5h-15z"/>
      </svg>
    ),
    Amazon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.09 18.15c-2.45.68-4.77 1.03-6.94.97-2.16-.06-3.98-.61-5.43-1.65-.09-.07-.16-.15-.19-.25-.03-.1.01-.2.11-.27.1-.07.21-.09.32-.04 1.27.72 2.89 1.16 4.85 1.31 1.95.15 4.05-.03 6.28-.55.17-.04.34.05.4.21.06.17-.02.35-.19.39l-.21.06zm1.66-.56c-.11-.14-.28-.16-.43-.05-1.22.95-2.64 1.64-4.24 2.07-1.59.43-3.21.54-4.84.33-.17-.02-.33.08-.37.24-.04.17.06.33.23.37 1.73.23 3.46.12 5.17-.33 1.71-.45 3.23-1.18 4.55-2.19.13-.1.15-.27.04-.4l-.11-.04zm2.04-8.34c-.16-.15-.42-.14-.57.03-1.52 1.66-3.42 2.94-5.7 3.83-2.27.89-4.61 1.24-7.01 1.05-.2-.02-.37.12-.4.31-.03.2.11.38.31.41 2.52.21 5-.16 7.42-1.1 2.41-.94 4.43-2.29 6.06-4.06.14-.16.12-.4-.03-.54l-.08.07z"/>
      </svg>
    ),
    WhatsApp: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  };

  const colorClass = platformColors[platform] || platformColors['Shopier'];
  const icon = platformIcons[platform] || platformIcons['Shopier'];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        relative flex-1 min-w-0 px-2 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-white transition-all duration-500 ease-out text-xs sm:text-sm
        transform active:scale-95 hover:scale-105 hover:-translate-y-1 overflow-hidden
        ${colorClass} flex items-center justify-center gap-1 sm:gap-2 group inline-flex
        before:absolute before:inset-0 before:bg-white/20 before:translate-y-full before:transition-transform before:duration-500
        hover:before:translate-y-0
      `}
    >
      {icon}
      <span className="relative z-10 font-semibold truncate">{platform}</span>
      <ExternalLink className="hidden sm:block w-3.5 h-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300" />
    </a>
  );
}