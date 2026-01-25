'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type AnimationType = 
  | 'fade' 
  | 'slide-up' 
  | 'slide-down'
  | 'slide-left' 
  | 'slide-right' 
  | 'scale' 
  | 'scale-rotate'
  | 'rotate'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-left';

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
}

export default function ScrollSection({
  children,
  className = '',
  animation = 'slide-up',
  delay = 0,
  duration = 0.6,
}: ScrollSectionProps) {

  // Animation variants
  const variants: Record<AnimationType, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'slide-up': {
      hidden: { opacity: 0, y: 75 },
      visible: { opacity: 1, y: 0 },
    },
    'slide-down': {
      hidden: { opacity: 0, y: -75 },
      visible: { opacity: 1, y: 0 },
    },
    'slide-left': {
      hidden: { opacity: 0, x: 75 },
      visible: { opacity: 1, x: 0 },
    },
    'slide-right': {
      hidden: { opacity: 0, x: -75 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    'scale-rotate': {
      hidden: { opacity: 0, scale: 0.5, rotate: -45 },
      visible: { opacity: 1, scale: 1, rotate: 0 },
    },
    rotate: {
      hidden: { opacity: 0, rotate: -10, scale: 0.9 },
      visible: { opacity: 1, rotate: 0, scale: 1 },
    },
    'zoom-in': {
      hidden: { opacity: 0, scale: 1.5 },
      visible: { opacity: 1, scale: 1 },
    },
    'zoom-out': {
      hidden: { opacity: 0, scale: 0.3 },
      visible: { opacity: 1, scale: 1 },
    },
    'flip-up': {
      hidden: { opacity: 0, rotateX: -90, transformPerspective: 1000 },
      visible: { opacity: 1, rotateX: 0, transformPerspective: 1000 },
    },
    'flip-left': {
      hidden: { opacity: 0, rotateY: -90, transformPerspective: 1000 },
      visible: { opacity: 1, rotateY: 0, transformPerspective: 1000 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      variants={variants[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
