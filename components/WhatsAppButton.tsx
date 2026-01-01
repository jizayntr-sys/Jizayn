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
      className={`w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-lg text-center transition-colors shadow-md flex items-center justify-center gap-2 text-lg ${
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      }`}
    >
      <MessageCircle className="w-6 h-6" />
      {label}
    </a>
  );
}