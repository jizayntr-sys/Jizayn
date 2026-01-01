'use client';

import { useState, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProductFilters() {
  const t = useTranslations('productsPage');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // URL'den gelen parametrelerle inputları senkronize et
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
    });
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
    });
  };

  return (
    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100 space-y-4 relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      )}
      {/* Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <span className="font-medium text-gray-700 whitespace-nowrap text-sm sm:text-base">{t('filter')}:</span>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'decor', 'furniture'].map((cat) => (
            <button
              key={cat}
              id={`filter-category-${cat}`}
              name="category"
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                currentCategory === cat
                  ? 'bg-indigo-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`categories.${cat}` as any)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price Range */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
          <label htmlFor="filter-min-price" className="font-medium text-gray-700 whitespace-nowrap text-sm sm:text-base">{t('priceRange.label')}:</label>
          <div className="flex items-center gap-2 flex-1">
          <input
            type="number"
            id="filter-min-price"
            name="minPrice"
            autoComplete="off"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={t('priceRange.min')}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            aria-label={t('priceRange.min')}
          />
          <span className="text-gray-500 text-sm">-</span>
          <input
            type="number"
            id="filter-max-price"
            name="maxPrice"
            autoComplete="off"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={t('priceRange.max')}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            aria-label={t('priceRange.max')}
          />
          <button 
            id="filter-apply-button"
            name="applyFilter"
            type="button"
            onClick={handlePriceFilter} 
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 whitespace-nowrap flex-shrink-0"
          >
            {t('priceRange.apply')}
          </button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 justify-start md:justify-end">
          <label htmlFor="sort" className="font-medium text-gray-700 whitespace-nowrap text-sm sm:text-base">{t('sort')}:</label>
          <select
            id="sort"
            name="sort"
            value={currentSort}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full md:w-auto"
          >
            <option value="newest">{t('sortOptions.newest')}</option>
            <option value="priceAsc">{t('sortOptions.priceAsc')}</option>
            <option value="priceDesc">{t('sortOptions.priceDesc')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}