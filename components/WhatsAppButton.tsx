'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  url: string;
  label: string;
  productName: string;
  isDisabled?: boolean;
}

export default function WhatsAppButton({ url, label, productName, isDisabled }: WhatsAppButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    // Google Analytics Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_whatsapp', {
        event_category: 'conversion',
        event_label: productName,
      });
    }
  };

  return (
    <a
      href={isDisabled ? undefined : url}
      target={isDisabled ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-disabled={isDisabled}
      className={`w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-4 px-6 rounded-lg text-center transition-all duration-500 shadow-lg flex items-center justify-center gap-2 text-lg group relative overflow-hidden
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:scale-105 hover:-translate-y-1'}
        before:absolute before:inset-0 before:bg-white/20 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0
      `}
    >
      <MessageCircle className="w-6 h-6 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
      <span className="relative z-10">{label}</span>
    </a>
  );
}