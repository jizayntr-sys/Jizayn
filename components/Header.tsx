'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Ana sayfa kontrolü
  const isHomePage = /^\/[a-z]{2}$/.test(pathname) || pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header sınıflarını belirle
  const headerClasses = isHomePage && !isScrolled
    ? 'bg-transparent border-transparent text-white'
    : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 text-gray-900';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerClasses}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image 
              src="/JizaynLogo.svg" 
              alt="Jizayn Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" 
              unoptimized
            />
            <span className={`text-2xl font-bold bg-clip-text text-transparent transition-all duration-300 ${
              isHomePage && !isScrolled 
                ? 'bg-gradient-to-r from-white to-gray-200' 
                : 'bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-indigo-700 group-hover:to-indigo-500'
            }`}>Jizayn</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: '/', label: t('home') },
              { href: '/products', label: t('products') },
              { href: '/about', label: t('about') },
              { href: '/contact', label: t('contact') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={`relative text-base font-medium transition-colors hover:text-indigo-700 py-2 group ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'text-indigo-700 font-semibold'
                    : (isHomePage && !isScrolled ? 'text-white/90 hover:text-white' : 'text-gray-600')
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-700 transform origin-left transition-transform duration-300 ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Right Side: Language & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-all duration-300 ${
                isHomePage && !isScrolled 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden absolute w-full left-0 bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {[
              { href: '/', label: t('home') },
              { href: '/products', label: t('products') },
              { href: '/about', label: t('about') },
              { href: '/contact', label: t('contact') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={`text-lg font-medium py-3 px-4 rounded-lg transition-all hover:bg-indigo-50 hover:text-indigo-700 ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'text-indigo-700 font-semibold bg-indigo-50'
                    : 'text-gray-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <div className="px-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
      </div>
    </header>
  );
}
