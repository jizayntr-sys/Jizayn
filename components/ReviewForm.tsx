'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const t = useTranslations('product.reviews');
  const tForm = useTranslations('product.reviews.form');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Lütfen bir puan seçin');
      return;
    }

    if (!captchaToken) {
      toast.error('Lütfen robot olmadığınızı doğrulayın');
      return;
    }
    
    setStatus('submitting');
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: formData.get('name'),
          rating,
          comment: formData.get('comment'),
          captchaToken,
        }),
      });

      if (!response.ok) throw new Error('Hata');

      toast.success(tForm('success'));
      setStatus('success');
      form.reset();
      setRating(0);
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
      
      // 3 saniye sonra formu tekrar aktif et (isteğe bağlı)
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      toast.error('Bir hata oluştu');
      setStatus('idle');
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('writeReview')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Yıldız Değerlendirme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {tForm('rating')}
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`${star} Yıldız`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* İsim Alanı */}
        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-1">
            {tForm('name')}
          </label>
          <input
            type="text"
            id="review-name"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Yorum Alanı */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
            {tForm('comment')}
          </label>
          <textarea
            id="review-comment"
            name="comment"
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div className="py-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            tForm('submit')
          )}
        </button>
      </form>
    </div>
  );
}