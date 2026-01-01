'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

// Örnek Müşteri Yorumları (İleride veritabanından çekilebilir)
const mockReviews = [
  {
    id: 1,
    author: 'Ayşe K.',
    comment: 'Ürün kalitesi beklentimin çok üzerinde. El işçiliği harika, evime çok farklı bir hava kattı. Kesinlikle tavsiye ederim!',
    rating: 5,
  },
  {
    id: 2,
    author: 'Mehmet T.',
    comment: 'Paketleme çok özenliydi ve ürün hasarsız elime ulaştı. Fotoğraflarda göründüğünden daha da güzel. Teşekkürler Jizayn!',
    rating: 5,
  },
  {
    id: 3,
    author: 'Elif S.',
    comment: 'Doğal ahşabın sıcaklığını hissetmek çok güzel. Modern tasarımı ve kalitesiyle salonumun yıldızı oldu.',
    rating: 5,
  },
  {
    id: 4,
    author: 'Can B.',
    comment: 'Hediye olarak almıştım, arkadaşım bayıldı. Benzersiz ve anlamlı bir hediye arayanlar için harika bir seçenek.',
    rating: 4,
  },
  {
    id: 5,
    author: 'Selin A.',
    comment: 'Müşteri hizmetleri çok ilgiliydi. Sipariş sürecinde her soruma anında yanıt aldım. Güvenilir bir marka.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-yellow-400 gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : ''}`} />
      ))}
    </div>
  );
}

export default function CustomerReviewsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth < 600 ? 300 : 400;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-white/10" aria-label="Previous Review">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-white/10" aria-label="Next Review">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x snap-mandatory px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {mockReviews.map((review) => (
          <div key={review.id} className="w-64 md:w-72 snap-start bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg hover:bg-white/20 transition-all duration-300 flex-shrink-0 flex flex-col justify-between h-64 relative overflow-hidden group/card">
            <Quote className="absolute top-4 right-4 w-12 h-12 text-white/10 group-hover/card:text-white/20 transition-colors" />
            <div>
              <div className="mb-4">
                <StarRating rating={review.rating} />
              </div>
              <blockquote className="text-white/90 text-lg leading-relaxed line-clamp-4">
                "{review.comment}"
              </blockquote>
            </div>
            <footer className="font-bold text-white mt-4 border-t border-white/10 pt-4">
              - {review.author}
            </footer>
          </div>
        ))}
      </div>
    </div>
  );
}