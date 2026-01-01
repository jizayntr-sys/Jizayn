'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';

type Review = {
  author: string;
  datePublished: string;
  reviewBody: string;
  reviewRating: number;
  reviewSource: string;
};

type Props = {
  reviews?: Review[];
  translations: {
    title: string;
    noReviews: string;
    writeReview: string;
    form: {
      name: string;
      rating: string;
      comment: string;
      submit: string;
      success: string;
    };
    loadMore: string;
    sort: {
      label: string;
      newest: string;
      oldest: string;
      ratingHigh: string;
      ratingLow: string;
    };
  };
};

function StarRating({ rating, onChange }: { rating: number; onChange?: (rating: number) => void }) {
  return (
    <div className="flex text-yellow-400 gap-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          className={`focus:outline-none ${onChange ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ reviews, translations }: Props) {
  // Ortalama puanı hesapla
  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.reviewRating, 0) / reviews.length).toFixed(1)
    : 0;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [newRating, setNewRating] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortBy, setSortBy] = useState('newest');

  // Yorumları sırala
  const sortedReviews = [...(reviews || [])].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime();
    }
    if (sortBy === 'ratingHigh') {
      return b.reviewRating - a.reviewRating;
    }
    if (sortBy === 'ratingLow') {
      return a.reviewRating - b.reviewRating;
    }
    return 0;
  });

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simülasyon: API isteği
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormStatus('success');
    setTimeout(() => {
      setIsFormOpen(false);
      setFormStatus('idle');
      setNewRating(0);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-bold text-gray-900">{translations.title}</h2>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
          >
            {translations.writeReview}
          </button>
        </div>
        
        {/* Sıralama Seçeneği */}
        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">{translations.sort.label}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-3 pr-8 bg-gray-50 border cursor-pointer outline-none"
            >
              <option value="newest">{translations.sort.newest}</option>
              <option value="oldest">{translations.sort.oldest}</option>
              <option value="ratingHigh">{translations.sort.ratingHigh}</option>
              <option value="ratingLow">{translations.sort.ratingLow}</option>
            </select>
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl">
            <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
            <div className="flex flex-col">
              <StarRating rating={Math.round(Number(averageRating))} />
              <span className="text-sm text-gray-500 mt-1">{reviews.length} Değerlendirme</span>
            </div>
          </div>
        )}
      </div>

      {/* Yorum Formu */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFormOpen ? 'max-h-[500px] opacity-100 mb-10' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 max-w-2xl mx-auto">
          {formStatus === 'success' ? (
            <div className="text-center py-8 text-green-600 font-medium">
              {translations.form.success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translations.form.name}</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translations.form.rating}</label>
                <div className="flex items-center gap-2">
                  <StarRating rating={newRating} onChange={setNewRating} />
                  <span className="text-sm text-gray-500 ml-2">{newRating}/5</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{translations.form.comment}</label>
                <textarea required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 mr-2"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting' || newRating === 0}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? '...' : translations.form.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {!reviews || reviews.length === 0 ? (
        <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl">{translations.noReviews}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedReviews.slice(0, visibleCount).map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{review.author}</h4>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.reviewRating} />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{review.datePublished}</span>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                {review.reviewBody}
              </p>
            </div>
          ))}
        </div>

          {reviews.length > visibleCount && (
            <div className="mt-10 text-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                {translations.loadMore} ({reviews.length - visibleCount} daha)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}