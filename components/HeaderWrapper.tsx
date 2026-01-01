'use client';

import { ReactNode } from 'react';

export default function HeaderWrapper({ children }: { children: ReactNode }) {
  // Desktop'ta tüm sayfalarda fixed, mobile'da da fixed
  return (
    <div className="fixed md:fixed top-0 left-0 w-full z-50">
      {children}
    </div>
  );
}