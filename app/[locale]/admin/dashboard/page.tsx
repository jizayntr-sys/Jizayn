import { prisma } from '@/lib/prisma';
import { approveReview, deleteReview, deleteProduct } from '../actions';
import Link from 'next/link';

// Route Segment Config - Vercel Serverless için
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default async function AdminDashboard() {
  let pendingReviews: any[] = [];
  let products: any[] = [];
  let error: string | null = null;
  let errorDetails: string | null = null;

  try {
    // 1. Onay bekleyen yorumları çek (İlişkili ürün bilgisiyle beraber)
    pendingReviews = await prisma.productReview.findMany({
      where: { isApproved: false },
      include: {
        ProductLocale: {
          select: {
            name: true,
            locale: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Pending reviews fetch error:', errorMessage);
    console.error('Full error:', err);
    error = 'Yorumlar yüklenirken hata oluştu';
    errorDetails = errorMessage;
  }

  try {
    // 2. Tüm ürünleri çek (Marka ve İsim bilgileriyle beraber)
    products = await prisma.product.findMany({
      include: {
        Brand: true,
        locales: true, // Ürün ismini bulmak için gerekli
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Products fetch error:', errorMessage);
    console.error('Full error:', err);
    if (!error) {
      error = 'Ürünler yüklenirken hata oluştu';
      errorDetails = errorMessage;
    }
  }

  return (
    <div className="pt-24 p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Yönetim Paneli</h1>
        <div className="flex gap-3">
          <Link 
            href="/tr/admin/product-order" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Ürün Sıralaması
          </Link>
          <Link 
            href="/tr/admin/utilities" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Yardımcı Araçlar
          </Link>
          <Link 
            href="/tr/admin/products/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <p className="font-semibold">⚠️ Hata:</p>
          <p>{error}</p>
          {errorDetails && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">Detaylar</summary>
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                {errorDetails}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* --- YORUM ONAY BÖLÜMÜ --- */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          Onay Bekleyen Yorumlar
          {pendingReviews.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
              {pendingReviews.length}
            </span>
          )}
        </h2>

        {pendingReviews.length === 0 ? (
          <p className="text-gray-500 italic">Şu an onay bekleyen yeni yorum yok.</p>
        ) : (
          <div className="grid gap-4">
            {pendingReviews.map((review: any) => {
              // Güvenli null kontrolü
              const productName = review.ProductLocale?.name || 'Ürün Bilgisi Yok';
              const productLocale = review.ProductLocale?.locale || 'N/A';
              
              return (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{review.author}</span>
                      <span className="text-sm text-gray-500">• {review.reviewRating}/5 Puan</span>
                      <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <p className="text-gray-800 mb-2 bg-gray-50 p-2 rounded">{review.reviewBody}</p>
                    <p className="text-xs text-gray-500">
                      Ürün: <span className="font-medium text-blue-600">{productName}</span> ({productLocale})
                    </p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                    <Link 
                      href={`/tr/admin/reviews/${review.id}`}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded text-sm transition font-medium text-center"
                    >
                      Düzenle
                    </Link>
                    <form action={approveReview.bind(null, review.id)}>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition font-medium">
                        Onayla
                      </button>
                    </form>
                    <form action={deleteReview.bind(null, review.id)}>
                      <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm transition font-medium">
                        Reddet / Sil
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </section>

      {/* --- ÜRÜN LİSTESİ BÖLÜMÜ --- */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Ürün Listesi</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Ürün Adı (TR)</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Marka</th>
                <th className="px-6 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product: any) => {
                // Türkçe ismi bulmaya çalış, yoksa ilk bulduğunu al, o da yoksa ID göster
                const displayName = product.locales.find((l: any) => l.locale === 'tr')?.name || product.locales[0]?.name || 'İsimsiz Ürün';
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {displayName}
                      {product.isFeatured && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Öne Çıkan</span>}
                    </td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">{product.Brand?.name || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/tr/admin/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded"
                        >
                          Düzenle
                        </Link>
                        <form action={deleteProduct.bind(null, product.id)}>
                          <button className="text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1 rounded">
                            Sil
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}