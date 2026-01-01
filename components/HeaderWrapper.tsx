'use client';

import { usePathname } from '@/i18n/navigation';
import { ReactNode } from 'react';

export default function HeaderWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // next-intl'den gelen usePathname, locale olmadan yolu verir.
  const isHomePage = pathname === '/';

  return (
    <div className={isHomePage ? "fixed top-0 left-0 w-full z-50" : "relative"}>
      {children}
    </div>
  );
}