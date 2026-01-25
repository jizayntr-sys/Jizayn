'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionScrollerProps {
  children: ReactNode;
  sectionId: string;
  className?: string;
  threshold?: number;
}

/**
 * Mouse wheel ve touch gesture ile otomatik section scroll
 * Her section'a smooth scroll animasyonu ekler
 */
export default function SectionScroller({
  children,
  sectionId,
  className = '',
  threshold = 0.5,
}: SectionScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  // Mouse wheel ile smooth scroll
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      if (!isInView || isScrolling) return;

      const delta = e.deltaY;
      const scrollThreshold = 50;

      if (Math.abs(delta) > scrollThreshold) {
        isScrolling = true;
        
        if (delta > 0) {
          // Scroll down - sonraki section'a git
          const nextSection = element.nextElementSibling as HTMLElement;
          if (nextSection && nextSection.id) {
            e.preventDefault();
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // Son section'dayız, normal scroll
            isScrolling = false;
            return;
          }
        } else {
          // Scroll up - önceki section'a git
          const prevSection = element.previousElementSibling as HTMLElement;
          if (prevSection && prevSection.id) {
            e.preventDefault();
            prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            isScrolling = false;
            return;
          }
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

    // Touch gesture desteği
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (!isInView || isScrolling) return;

      const swipeDistance = touchStartY - touchEndY;
      const swipeThreshold = 50;

      if (Math.abs(swipeDistance) > swipeThreshold) {
        isScrolling = true;

        if (swipeDistance > 0) {
          // Swipe up - sonraki section
          const nextSection = element.nextElementSibling as HTMLElement;
          if (nextSection && nextSection.id) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            isScrolling = false;
            return;
          }
        } else {
          // Swipe down - önceki section
          const prevSection = element.previousElementSibling as HTMLElement;
          if (prevSection && prevSection.id) {
            prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            isScrolling = false;
            return;
          }
        }

        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(scrollTimeout);
    };
  }, [isInView]);

  return (
    <motion.section
      ref={ref}
      id={sectionId}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.section>
  );
}
