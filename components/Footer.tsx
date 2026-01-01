'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Facebook, Instagram, Send, Loader2, Youtube, Linkedin, Twitter } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import toast from 'react-hot-toast';

type Props = {
  hideOnHome?: boolean;
};

export default function Footer({ hideOnHome = false }: Props) {
  const t = useTranslations('footer');
  const pathname = usePathname();
  const isHomePage = /^\/[a-z]{2}$/.test(pathname) || pathname === '/';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (hideOnHome && isHomePage) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Abonelik başarısız');

      toast.success(t('newsletter.success'));
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const socialLinks = [
    { 
      href: "https://www.instagram.com/jizayn", 
      label: "Instagram", 
      icon: <Instagram className="w-5 h-5" />,
      color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500"
    },
    { 
      href: "https://www.facebook.com/jizayn", 
      label: "Facebook", 
      icon: <Facebook className="w-5 h-5" />,
      color: "hover:bg-[#1877F2]"
    },
    { 
      href: "https://www.youtube.com/@jizayn", 
      label: "YouTube", 
      icon: <Youtube className="w-5 h-5" />,
      color: "hover:bg-[#FF0000]"
    },
    { 
      href: "https://www.linkedin.com/company/jizayn", 
      label: "LinkedIn", 
      icon: <Linkedin className="w-5 h-5" />,
      color: "hover:bg-[#0A66C2]"
    },
    { 
      href: "https://www.tiktok.com/@jizayn", 
      label: "TikTok", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      color: "hover:bg-black hover:shadow-[2px_2px_0px_rgba(255,0,80,1),-2px_-2px_0px_rgba(0,242,234,1)]" // TikTok renk efekti
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" role="contentinfo">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{t('newsletter.title')}</h3>
              <p className="text-gray-400 text-sm">{t('newsletter.description')}</p>
            </div>
            
            <div className="w-full max-w-md">
              
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {t('newsletter.placeholder')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    id="newsletter-email"
                    name="email"
                    autoComplete="email"
                    disabled={status === 'loading'}
                    className={`px-5 py-3 rounded-full bg-gray-800/50 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full transition-all ${
                      status === 'error' ? 'border-red-500 focus:ring-red-500' : 'border-gray-700'
                    }`}
                  />
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center group"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="sr-only">{t('newsletter.button')}</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 py-12 lg:py-16">
          {/* Logo and Description */}
          <div className="col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/JizaynLogo.svg" 
                alt="Jizayn" 
                width={40} 
                height={40} 
                className="w-10 h-10" 
                unoptimized
              />
              <h3 className="text-3xl font-bold text-white">Jizayn</h3>
            </div>
            <p className="text-gray-400 pr-8">{t('description')}</p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-lg font-semibold mb-4 text-white">{t('nav.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-lg font-semibold mb-4">{t('nav.legal')}</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('nav.privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('nav.terms')}</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">{t('nav.cookies')}</Link></li>
              <li><Link href="/kvkk" className="hover:text-white transition-colors">{t('nav.kvkk')}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 lg:col-span-3">
            <h4 className="text-lg font-semibold mb-4">{t('followUs')}</h4>
            <div className="flex items-center space-x-4">
              {socialLinks.map(link => (
                <a 
                  key={link.label} 
                  href={link.href as any} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={link.label} 
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white hover:-translate-y-1 hover:shadow-lg ${link.color}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 text-center sm:text-left">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
