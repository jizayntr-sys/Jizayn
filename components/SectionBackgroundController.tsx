'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';

export default function SectionBackgroundController() {
  const [bgClass, setBgClass] = useState('bg-transparent backdrop-blur-none');
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // ✅ Basitleştirilmiş kontrol - next-intl pathname'i zaten / olarak verir
  const isHomePage = pathname === '/';

  useEffect(() => {
    // Ana sayfa değilse hiçbir şey yapma
    if (!isHomePage) {
      // Eğer observer varsa temizle
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Sections'ları bul
    const sections = document.querySelectorAll('section[id]');
    
    // Section yoksa bekle
    if (sections.length === 0) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target.id) {
            case 'hero':
              setBgClass('bg-transparent backdrop-blur-none');
              break;
            case 'features':
              setBgClass('bg-blue-900/20 backdrop-blur-md');
              break;
            case 'featured':
              setBgClass('bg-orange-900/20 backdrop-blur-md');
              break;
            case 'reviews':
              setBgClass('bg-green-900/20 backdrop-blur-md');
              break;
            case 'footer':
              setBgClass('bg-black/80 backdrop-blur-md');
              break;
          }
        }
      });
    };

    // Observer oluştur
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
      rootMargin: '0px'
    });

    // Sections'ları gözlemle
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    // Cleanup - pathname değiştiğinde veya component unmount olduğunda
    return () => {
      if (observerRef.current) {
        // Önce disconnect et
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      // Background'u resetle
      setBgClass('bg-transparent backdrop-blur-none');
    };
  }, [isHomePage, pathname]); // ✅ pathname'i dependency'e ekledik

  // Ana sayfa değilse hiç render etme
  if (!isHomePage) {
    return null;
  }

  return (
    <div className={`fixed inset-0 -z-10 transition-all duration-1000 ease-in-out ${bgClass}`} />
  );
}
