'use client';

import { useTranslations, useLocale } from 'next-intl';
import { User, Calendar } from 'lucide-react';
import { ProductReview } from '@/types/product';
import ProductRating from './ProductRating';

interface ReviewListProps {
  reviews?: ProductReview[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const t = useTranslations('product.reviews');
  const locale = useLocale();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
        <p className="text-gray-500">{t('noReviews')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review, index) => (
        <div key={index} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  {review.author}
                  {review.reviewSource && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-bold">
                      {review.reviewSource}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={review.datePublished}>
                    {new Date(review.datePublished).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <ProductRating 
              aggregateRating={{ ratingValue: review.reviewRating, reviewCount: 1 }} 
              showCount={false} 
              size="sm" 
            />
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            {review.reviewBody}
          </p>
        </div>
      ))}
    </div>
  );
}