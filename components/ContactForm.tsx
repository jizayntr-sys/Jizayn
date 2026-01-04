'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const subject = formData.get('subject') as string;

    // Simüle edilmiş form gönderimi
    // Gerçek bir API entegrasyonunda buraya fetch isteği gelecektir
    setTimeout(() => {
      // Google Analytics Event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: `Contact Form - ${subject || 'General Inquiry'}`,
        });
      }

      toast.success(t('success'));
      setStatus('success');
      form.reset();
      window.location.href = '/thank-you';
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-form-name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('name')}
        </label>
        <input
          type="text"
          id="contact-form-name"
          name="name"
          autoComplete="name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 outline-none transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="contact-form-email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('email')}
        </label>
        <input
          type="email"
          id="contact-form-email"
          name="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 outline-none transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="contact-form-subject" className="block text-sm font-medium text-gray-700 mb-1">
          {t('subject')}
        </label>
        <input
          type="text"
          id="contact-form-subject"
          name="subject"
          autoComplete="off"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 outline-none transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="contact-form-message" className="block text-sm font-medium text-gray-700 mb-1">
          {t('message')}
        </label>
        <textarea
          id="contact-form-message"
          name="message"
          rows={4}
          autoComplete="off"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 outline-none transition-all duration-300 resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group
          before:absolute before:inset-0 before:bg-white/20 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            <span className="relative z-10">{t('submitting')}</span>
          </>
        ) : (
          <span className="relative z-10">{t('submit')}</span>
        )}
      </button>
    </form>
  );
}