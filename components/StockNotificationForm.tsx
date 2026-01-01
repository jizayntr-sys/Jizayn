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
        className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
      >
        <Bell className="w-5 h-5" />
        {translations.title}
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
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={translations.emailPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      translations.submit
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