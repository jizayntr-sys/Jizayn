'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';
import Image from 'next/image';

interface ProductVideoProps {
  video: string;
  poster?: string;
  title?: string;
}

export default function ProductVideo({ video, poster, title }: ProductVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = () => {
    // YouTube URL kontrolü
    const youtubeMatch = video.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    // Vimeo URL kontrolü
    const vimeoMatch = video.match(/(?:vimeo\.com\/)([^"&?\/\s]+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return video;
  };

  if (isPlaying) {
    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title || 'Ürün Videosu'}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      aria-label={title || 'Videoyu oynat'}
      className="relative aspect-video w-full bg-gray-200 rounded-lg overflow-hidden group cursor-pointer block"
    >
      {poster && (
        <Image
          src={poster}
          alt={title || 'Ürün videosu önizleme'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
          <Play className="w-12 h-12 text-indigo-600 fill-indigo-600" />
        </div>
      </div>
    </button>
  );
}
