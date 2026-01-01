import { ImageResponse } from 'next/og';
import { products } from '@/data/products';

// Edge runtime kullanarak görselin çok hızlı oluşturulmasını sağlıyoruz
export const runtime = 'edge';

export const alt = 'Jizayn Ürün Detayı';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;

  // Slug ve locale bilgisine göre ürünü buluyoruz
  const product = products.find((p) => {
    const pData = p.locales[locale as keyof typeof p.locales];
    return pData && pData.slug === slug;
  });

  const productData = product?.locales[locale as keyof typeof product.locales];

  // Eğer ürün bulunamazsa varsayılan bir görsel döndür
  if (!productData) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#111827',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Jizayn
        </div>
      ),
      { ...size }
    );
  }

  // Ürün görselinin tam URL'sini oluştur (Satori için absolute URL gerekir)
  const imageUrl = productData.images[0].url.startsWith('http') 
    ? productData.images[0].url 
    : `https://www.jizayn.com${productData.images[0].url}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#111827',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Arkaplan Görseli */}
        <img
          src={imageUrl}
          alt={productData.name}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.5, // Yazının okunması için karartma
          }}
        />
        
        {/* İçerik */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              marginBottom: 20,
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              lineHeight: 1.1,
            }}
          >
            {productData.name}
          </h1>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#4F46E5', // Indigo-600
              color: 'white',
              padding: '16px 48px',
              borderRadius: '50px',
              fontSize: 36,
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.5)',
            }}
          >
            {productData.priceRange.min} {productData.priceRange.currency}
          </div>
        </div>

        {/* Logo / Marka */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            color: 'rgba(255,255,255,0.8)',
            fontSize: 24,
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          jizayn.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}