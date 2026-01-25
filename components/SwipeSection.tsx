'use client';

import { motion, useAnimation, PanInfo } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface SwipeSectionProps {
  children: ReactNode;
  className?: string;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

/**
 * Mobil cihazlarda swipe gesture desteği
 * Yukarı/aşağı swipe ile section geçişi
 */
export default function SwipeSection({
  children,
  className = '',
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: SwipeSectionProps) {
  const [isSwipeing, setIsSwipeing] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;

    // Hızlı swipe kontrolü
    const swipeVelocityThreshold = 500;
    const isFastSwipe = Math.abs(velocity.y) > swipeVelocityThreshold;

    // Swipe mesafesi kontrolü
    const isLongSwipe = Math.abs(offset.y) > threshold;

    if (isFastSwipe || isLongSwipe) {
      setIsSwipeing(true);

      if (offset.y < 0 && onSwipeUp) {
        // Yukarı swipe
        await controls.start({
          y: -100,
          opacity: 0,
          transition: { duration: 0.3, ease: 'easeOut' },
        });
        onSwipeUp();
      } else if (offset.y > 0 && onSwipeDown) {
        // Aşağı swipe
        await controls.start({
          y: 100,
          opacity: 0,
          transition: { duration: 0.3, ease: 'easeOut' },
        });
        onSwipeDown();
      }

      setIsSwipeing(false);
    } else {
      // Swipe başarısız, eski konuma dön
      await controls.start({
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });
    }
  };

  return (
    <motion.div
      className={className}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ y: 0, opacity: 1 }}
      style={{
        touchAction: 'pan-y',
        position: 'relative',
      }}
    >
      {/* Swipe indicator */}
      {!isSwipeing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-12 h-1 bg-white/30 rounded-full"
          />
        </div>
      )}
      
      {children}
    </motion.div>
  );
}
