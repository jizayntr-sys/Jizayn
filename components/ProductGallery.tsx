'use client';

import { useState, useEffect, TouchEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

type ProductImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [transformOrigin, setTransformOrigin] = useState({ x: 50, y: 50 });

  // Minimum kaydırma mesafesi (piksel)
  const minSwipeDistance = 50;

  const selectedImage = images[selectedIndex];

  // Klavye olaylarını dinle (Sağ/Sol Ok ve Escape)
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, images.length]);

  // Modal açıkken arka plan kaydırmasını engelle
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Görsel değiştiğinde yükleme durumunu sıfırla
  useEffect(() => {
    setIsImageLoading(true);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setTransformOrigin({ x: 50, y: 50 });
  }, [selectedIndex]);

  // Zoom Toggle
  const handleZoomToggle = () => {
    if (zoom > 1) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } else {
      setZoom(2.5);
    }
  };

  // Mouse Events (Desktop Lens Effect)
  const handleMouseMove = (e: React.MouseEvent) => {
    // Zoom kapalıysa ve mouse görsel üzerindeyse otomatik zoom yap
    if (zoom === 1) {
      setZoom(2.5);
    }

    if (zoom > 1 && !isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTransformOrigin({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setZoom(1);
    setTransformOrigin({ x: 50, y: 50 });
  };

  // Dokunmatik kaydırma (swipe) olayları
  const onTouchStart = (e: TouchEvent) => {
    setTransformOrigin({ x: 50, y: 50 }); // Dokunmatikte origin'i merkeze al
    if (zoom === 1) {
      setTouchStart(e.targetTouches[0].clientX);
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.targetTouches[0].clientX - offset.x,
        y: e.targetTouches[0].clientY - offset.y
      });
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (zoom > 1 && isDragging) {
      setOffset({
        x: e.targetTouches[0].clientX - dragStart.x,
        y: e.targetTouches[0].clientY - dragStart.y
      });
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (zoom === 1) {
      if (touchStart === null) return;
      
      const touchEnd = e.changedTouches[0].clientX;
      const distance = touchStart - touchEnd;

      if (distance > minSwipeDistance) {
        setSelectedIndex((prev) => (prev + 1) % images.length);
      } else if (distance < -minSwipeDistance) {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      setTouchStart(null);
    } else {
      setIsDragging(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
      {/* Ana Görsel */}
        <div 
          className="relative h-64 sm:h-80 md:h-[500px] w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-100 cursor-zoom-in group"
          onClick={() => setIsModalOpen(true)}
        >
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Küçük Resimler (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-indigo-600 ring-2 ring-indigo-100' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Kapat"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Zoom Toggle Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleZoomToggle(); }}
            className="absolute top-4 right-16 text-white/70 hover:text-white transition-colors z-10"
            aria-label={zoom > 1 ? "Uzaklaştır" : "Yakınlaştır"}
          >
            {zoom > 1 ? <ZoomOut className="w-8 h-8" /> : <ZoomIn className="w-8 h-8" />}
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Prev Button */}
            {images.length > 1 && zoom === 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                aria-label="Önceki görsel"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Loading Spinner */}
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              width={1600}
              height={1200}
              className={`max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              } ${zoom > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              style={{
                transformOrigin: `${transformOrigin.x}% ${transformOrigin.y}%`,
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              priority
              onLoad={() => setIsImageLoading(false)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />

            {/* Next Button */}
            {images.length > 1 && zoom === 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
                aria-label="Sonraki görsel"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-20 px-4">
            <p className="text-white/90 text-sm font-medium bg-black/40 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}