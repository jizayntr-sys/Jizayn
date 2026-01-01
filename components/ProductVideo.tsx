'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { ProductVideo as ProductVideoType } from '@/types/product';
import Image from 'next/image';

interface ProductVideoProps {
  video: ProductVideoType;
}

export default function ProductVideo({ video }: ProductVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = () => {
    if (video.type === 'youtube') {
      const videoId = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : video.url;
    }
    if (video.type === 'vimeo') {
      const videoId = video.url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : video.url;
    }
    return video.url;
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
          title="Ürün Videosu"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group cursor-pointer">
      {video.thumbnail && (
        <Image
          src={video.thumbnail}
          alt="Video thumbnail"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
        onClick={() => setIsPlaying(true)}
      >
        <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
          <Play className="w-12 h-12 text-wood-600 fill-wood-600" />
        </div>
      </div>
    </div>
  );
}

