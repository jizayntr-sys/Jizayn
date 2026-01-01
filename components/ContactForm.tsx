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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}