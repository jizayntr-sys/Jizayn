'use client';

import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

type Props = {
  translations: {
    title: string;
    description: string;
    emailPlaceholder: string;
    submit: string;
    success: string;
    error: string;
  };
  productId: string;
};

export default function StockNotificationForm({ translations, productId }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isOpen, setIsOpen] = useState(false);

  // Modal açıkken arka plan kaydırmasını engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simülasyon: API isteği gönderiliyor gibi bekletelim
    // Gerçek projede burada veritabanına kayıt işlemi yapılır
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Stok bildirimi isteği: Ürün ${productId}, Email: ${email}`);
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Tetikleyici Buton */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-3 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-500 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_30px_rgba(17,24,39,0.4)] hover:scale-105 hover:-translate-y-1 group relative overflow-hidden
          before:absolute before:inset-0 before:bg-white/10 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0"
      >
        <Bell className="w-5 h-5 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
        <span className="relative z-10">{translations.title}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{translations.title}</h3>
            </div>
            
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                <p className="text-green-800 font-medium mb-2">{translations.success}</p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-sm text-green-700 font-semibold hover:underline"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">{translations.description}</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="stock-notification-email" className="sr-only">
                      {translations.emailPlaceholder}
                    </label>
                    <input
                      type="email"
                      id="stock-notification-email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={translations.emailPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 outline-none transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-500 font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group
                      before:absolute before:inset-0 before:bg-white/20 before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0"
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                    ) : (
                      <span className="relative z-10">{translations.submit}</span>
                    )}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-600 text-sm">{translations.error}</p>
                  )}
                </form>
              </>
            )}
          </div>
          {/* Arka plana tıklayınca kapat */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}