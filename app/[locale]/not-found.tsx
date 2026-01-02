import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllProducts } from '@/data/products';
import Image from 'next/image';
import { formatPrice } from '@/utils/currency';

// Rastgele ürün seçmek için yardımcı fonksiyon
function getRandomItems<T>(arr: T[], n: number): T[] {
  // Diziyi karıştır ve ilk n elemanı al
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const locale = await getLocale();

  // 3 adet rastgele ürün seç
  const allProducts = await getAllProducts(locale);
  const randomProducts = getRandomItems(allProducts, 3);

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-black text-gray-100 select-none mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {t('title')}
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        {t('description')}
      </p>
      <Link
        href="/"
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
      >
        {t('backHome')}
      </Link>

      {/* "Bunlar İlginizi Çekebilir" Bölümü */}
      {randomProducts.length > 0 && (
        <div className="w-full max-w-5xl mt-24 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('featuredProducts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {randomProducts.map((product) => {
              const productData = product.locales[locale as keyof typeof product.locales];
              if (!productData) return null;

              return (
                <Link 
                  key={product.id} 
                  href={{ pathname: '/products/[slug]', params: { slug: productData.slug } } as any}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={productData.images[0].url}
                      alt={productData.images[0].alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">
                      {productData.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
                      </span>
                      <span className="text-sm text-indigo-700 font-medium group-hover:underline">İncele &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}