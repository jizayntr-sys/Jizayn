'use client';

import { useState } from 'react';
import { Share2, Check, Facebook, Twitter, MessageCircle, Instagram } from 'lucide-react';

type Props = {
  url: string;
  title: string;
  translations: {
    title: string;
    copied: string;
    instagram: string;
  };
};

export default function ShareButtons({ url, title, translations }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  // Sosyal medya paylaşım linkleri
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;

  return (
    <div className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-lg shadow-md bg-white">
      <span className="text-sm font-medium text-gray-700">{translations.title}</span>
      
      <div className="flex gap-2">
        {/* Yerel Paylaşım / Link Kopyala */}
        <button 
          onClick={handleShare}
          className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors border border-gray-200"
          title="Paylaş / Kopyala"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
        </button>

        {/* Facebook */}
        <a 
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white transition-colors"
          aria-label="Facebook'ta Paylaş"
        >
          <Facebook className="w-5 h-5" />
        </a>

        {/* Twitter/X */}
        <a 
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white transition-colors"
          aria-label="Twitter'da Paylaş"
        >
          <Twitter className="w-5 h-5" />
        </a>

        {/* WhatsApp */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors"
          aria-label="WhatsApp'ta Paylaş"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/jizayn"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-gradient-to-br from-[#E4405F] via-[#F56040] to-[#FCAF45] text-white transition-opacity hover:opacity-90"
          aria-label={translations.instagram}
        >
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}