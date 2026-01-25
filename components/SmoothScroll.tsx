'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    // Smooth scroll behavior için CSS ekle
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Section'lar arası scroll için wheel event handler
  useEffect(() => {
    let isScrolling = false;
    
    const handleWheel = (e: WheelEvent) => {
      // Eğer zaten scroll animasyonu varsa, yeni eventi ignore et
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      // Küçük scroll hareketlerini ignore et (hassasiyet için)
      if (Math.abs(e.deltaY) < 10) return;

      // Section ID'lerini al
      const sections = document.querySelectorAll('section[id]');
      const currentScrollPos = window.scrollY + window.innerHeight / 2;
      
      let currentSection: HTMLElement | null = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        if (currentScrollPos >= sectionTop && currentScrollPos <= sectionBottom) {
          currentSection = section as HTMLElement;
        }
      });

      if (!currentSection) return;

      // Aşağı scroll
      if (e.deltaY > 0) {
        const nextSection = currentSection.nextElementSibling;
        if (nextSection && nextSection.tagName === 'SECTION') {
          isScrolling = true;
          (nextSection as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { isScrolling = false; }, 1000);
        }
      } 
      // Yukarı scroll
      else {
        const prevSection = currentSection.previousElementSibling;
        if (prevSection && prevSection.tagName === 'SECTION') {
          isScrolling = true;
          (prevSection as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { isScrolling = false; }, 1000);
        }
      }
    };

    // Sadece desktop'ta section snap aktif olsun
    if (window.innerWidth >= 1024) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return null;
}
