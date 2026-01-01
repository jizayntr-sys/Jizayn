'use client';

import { Star, StarHalf } from 'lucide-react';
import { ProductReview } from '@/types/product';

interface ProductRatingProps {
  reviews?: ProductReview[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductRating({ 
  reviews, 
  aggregateRating, 
  showCount = true,
  size = 'md' 
}: ProductRatingProps) {
  let rating = 0;
  let count = 0;

  // Veri kaynağını belirle (Aggregate data veya ham yorumlar)
  if (aggregateRating) {
    rating = aggregateRating.ratingValue;
    count = aggregateRating.reviewCount;
  } else if (reviews && reviews.length > 0) {
    const total = reviews.reduce((acc, review) => acc + review.reviewRating, 0);
    rating = total / reviews.length;
    count = reviews.length;
  }

  // Hiç yorum yoksa
  if (count === 0) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`${size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-300`} />
          ))}
        </div>
        {showCount && <span>(0)</span>}
      </div>
    );
  }

  // Puanı yuvarla (örn: 4.3 -> 4.5, 4.1 -> 4.0)
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  
  const starSizeClass = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center" title={`${rating.toFixed(1)} / 5`}>
        {[...Array(5)].map((_, i) => {
          const starIndex = i + 1;
          if (starIndex <= fullStars) {
            return <Star key={i} className={`${starSizeClass} fill-yellow-400 text-yellow-400`} />;
          } else if (starIndex === fullStars + 1 && hasHalfStar) {
            return <StarHalf key={i} className={`${starSizeClass} text-yellow-400 fill-yellow-400`} />;
          } else {
            return <Star key={i} className={`${starSizeClass} text-gray-300`} />;
          }
        })}
      </div>
      {showCount && (
        <span className={`text-gray-600 font-medium ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {rating.toFixed(1)} <span className="text-gray-400 font-normal">({count})</span>
        </span>
      )}
    </div>
  );
}