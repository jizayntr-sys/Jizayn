'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/utils/currency';
import { Product } from '@/types/product';

type Props = {
  products: Product[];
  locale: string;
};

export default function FeaturedCarousel({ products, locale }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth < 600 ? 300 : 400;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-white/10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-white/10"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x snap-mandatory px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          // @ts-ignore
          const productData = product.locales[locale];
          if (!productData) return null;

          return (
            <Link 
              key={product.id} 
              href={{ pathname: '/products/[slug]', params: { slug: productData.slug } } as any}
              className="min-w-[280px] max-w-[350px] md:min-w-[350px] snap-start group/card block bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:shadow-xl hover:bg-white/20 transition-all duration-300 flex-shrink-0"
            >
              <div className="relative aspect-square w-full max-h-[350px] bg-gray-100 overflow-hidden flex items-center justify-center">
                {productData.images && productData.images.length > 0 ? (
                  <Image
                    src={productData.images[0].url}
                    alt={productData.images[0].alt}
                    fill
                    className="object-contain group-hover/card:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-700/50">
                    <span className="text-gray-300 text-sm">Görsel Yok</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover/card:text-indigo-300 transition-colors line-clamp-1">
                  {productData.name}
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-white">
                    {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
                  </span>
                  <span className="text-sm text-indigo-300 font-medium group-hover/card:underline">İncele &rarr;</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}