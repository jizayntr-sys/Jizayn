import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/currency';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

interface SimilarProductsProps {
  category: string;
  currentProductId: string;
  locale: string;
}

export default async function SimilarProducts({ category, currentProductId, locale }: SimilarProductsProps) {
  const t = await getTranslations({ locale, namespace: 'product' });

  // 1. Aynı kategorideki ürünleri bul
  // 2. Şu an görüntülenen ürünü (currentProductId) hariç tut
  // 3. İlk 3 tanesini al
  const similarProducts = products
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 3);

  // Eğer benzer ürün yoksa bölümü hiç gösterme
  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 py-12 bg-gray-50/50 rounded-3xl">
      <div className="px-4 md:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900 relative inline-block">
            {t('similarProducts') || 'Benzer Ürünler'}
            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-indigo-600 rounded-full"></span>
          </h2>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {similarProducts.map((product) => {
            const productData = product.locales[locale as any];
            if (!productData) return null;

            return (
              <Link 
                key={product.id} 
                href={{ pathname: '/products/[slug]', params: { slug: productData.slug } } as any}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-72 w-full bg-gray-200 overflow-hidden">
                  <Image
                    src={productData.images[0].url}
                    alt={productData.images[0].alt}
                    width={600}
                    height={400}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">
                      {productData.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{productData.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(productData.priceRange.min, productData.priceRange.currency, locale)}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                      {t('viewProduct') || 'İncele'}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}