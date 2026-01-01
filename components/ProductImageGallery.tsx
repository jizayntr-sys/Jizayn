'use client';

import { useState, MouseEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProductImage } from '@/types/product';
import { generatePinterestDescription } from '@/utils/image-seo';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  productDescription?: string;
  locale?: string;
}

export default function ProductImageGallery({
  images,
  productName,
  productDescription = '',
  locale = 'tr',
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const t = useTranslations('product');

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Görsel Yok</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];
  
  // Placeholder görsel URL'i (SVG data URI)
  const placeholderImage = '/placeholder.svg';
  
  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };
  
  const getImageSrc = (image: ProductImage, index: number) => {
    if (imageErrors.has(index)) {
      return placeholderImage;
    }
    if (!image.url) {
      return placeholderImage;
    }
    return image.url;
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Ana Görsel */}
      <div 
        className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden group cursor-zoom-in"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={getImageSrc(currentImage, selectedIndex)}
          alt={
            currentImage.alt ||
            t('imageAlt', {
              name: productName,
              index: selectedIndex + 1,
            })
          }
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
          loading={selectedIndex === 0 ? 'eager' : 'lazy'}
          fetchPriority={selectedIndex === 0 ? 'high' : 'auto'}
          onError={() => handleImageError(selectedIndex)}
          data-pin-description={
            currentImage.pinterestDescription ||
            generatePinterestDescription(productName, productDescription, locale)
          }
        />
        
        {/* Zoom Overlay */}
        {isZooming && (
          <div
            className="absolute inset-0 pointer-events-none hidden md:block bg-white"
            style={{
              backgroundImage: `url(${getImageSrc(currentImage, selectedIndex)})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
        
        {/* Navigasyon Butonları */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Görsel Sayacı */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Galerisi */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-wood-600 ring-2 ring-wood-200'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={getImageSrc(image, index)}
                alt={
                  image.alt ||
                  t('imageAlt', {
                    name: productName,
                    index: index + 1,
                  })
                }
                fill
                className="object-cover"
                sizes="(max-width: 768px) 16vw, 8vw"
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={() => handleImageError(index)}
                data-pin-description={
                  image.pinterestDescription ||
                  generatePinterestDescription(productName, productDescription, locale)
                }
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal (Tam Ekran Görüntüleme) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Kapat"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageSrc(currentImage, selectedIndex)}
              alt={
                currentImage.alt ||
                t('imageAlt', {
                  name: productName,
                  index: selectedIndex + 1,
                })
              }
              width={currentImage.width || 1920}
              height={currentImage.height || 1080}
              className="max-w-full max-h-[90vh] object-contain"
              priority
              onError={() => handleImageError(selectedIndex)}
              data-pin-description={
                currentImage.pinterestDescription ||
                generatePinterestDescription(productName, productDescription, locale)
              }
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                  aria-label="Önceki görsel"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                  aria-label="Sonraki görsel"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
