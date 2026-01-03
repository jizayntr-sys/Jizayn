import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { updateProduct } from '../../actions';
import ImageUploadInput from '@/components/ImageUploadInput';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      locales: {
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const trLocale = product.locales.find((l: any) => l.locale === 'tr');
  const enLocale = product.locales.find((l: any) => l.locale === 'en');

  return (
    <div className="pt-24 p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Link href="/tr/admin/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Geri Dön
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Ürün Düzenle</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form action={updateProduct} className="space-y-6" encType="multipart/form-data">
          <input type="hidden" name="productId" value={product.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <input
                type="text"
                name="category"
                defaultValue={product.category}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                defaultChecked={product.isFeatured}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Öne Çıkan Ürün</label>
            </div>
          </div>

          {/* Türkçe İçerik */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Türkçe İçerik</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı (TR)</label>
                <input
                  type="text"
                  name="name_tr"
                  defaultValue={trLocale?.name}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (TR)</label>
                <textarea
                  name="description_tr"
                  defaultValue={trLocale?.description}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug (TR)</label>
                  <input
                    type="text"
                    name="slug_tr"
                    defaultValue={trLocale?.slug}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU (TR)</label>
                  <input
                    type="text"
                    name="sku_tr"
                    defaultValue={trLocale?.sku}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Durumu</label>
                  <select
                    name="availability_tr"
                    defaultValue={trLocale?.availability}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="InStock">Stokta</option>
                    <option value="OutOfStock">Stokta Yok</option>
                    <option value="PreOrder">Ön Sipariş</option>
                    <option value="BackOrder">Sipariş Üzerine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Fiyat (TRY)</label>
                  <input
                    type="number"
                    name="priceMin_tr"
                    step="0.01"
                    defaultValue={trLocale?.priceMin.toString()}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Fiyat (TRY)</label>
                  <input
                    type="number"
                    name="priceMax_tr"
                    step="0.01"
                    defaultValue={trLocale?.priceMax.toString()}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* İngilizce İçerik */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">İngilizce İçerik</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı (EN)</label>
                <input
                  type="text"
                  name="name_en"
                  defaultValue={enLocale?.name}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (EN)</label>
                <textarea
                  name="description_en"
                  defaultValue={enLocale?.description}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug (EN)</label>
                  <input
                    type="text"
                    name="slug_en"
                    defaultValue={enLocale?.slug}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU (EN)</label>
                  <input
                    type="text"
                    name="sku_en"
                    defaultValue={enLocale?.sku}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mevcut Görseller */}
          {trLocale && trLocale.images.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Mevcut Görseller</h3>
              <p className="text-sm text-gray-600 mb-4">
                💡 <strong>Order değeri en küçük olan resim</strong> ürün listesinde önizleme olarak gösterilir. (0 = İlk resim, 1 = İkinci resim, vs.)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trLocale.images.map((img: any, index: number) => (
                  <div key={img.id} className="space-y-2 border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="relative aspect-square">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover rounded-lg"
                      />
                      {img.order === 0 && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Önizleme
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Order (Sıra)</label>
                      <input
                        type="number"
                        name={`existingImage_${index}_order`}
                        defaultValue={img.order}
                        min="0"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-semibold text-center"
                      />
                    </div>
                    <input
                      type="text"
                      name={`existingImage_${index}_url`}
                      defaultValue={img.url}
                      placeholder="Görsel URL"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      name={`existingImage_${index}_alt`}
                      defaultValue={img.alt}
                      placeholder="Alt Text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={`existingImage_${index}_delete`}
                        id={`delete_${img.id}`}
                        className="w-4 h-4 text-red-600"
                      />
                      <label htmlFor={`delete_${img.id}`} className="text-sm text-red-600">
                        Sil
                      </label>
                    </div>
                    <input type="hidden" name={`existingImage_${index}_id`} value={img.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yeni Görseller Ekle */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Yeni Görseller Ekle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <ImageUploadInput key={num} num={num} />
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600">
              💡 <strong>İpucu:</strong> URL girebilir veya dosya yükleyebilirsiniz. Dosya yükleme otomatik olarak WebP formatına dönüştürülür ve optimize edilir.
            </p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-4 justify-end border-t pt-6">
            <Link
              href="/tr/admin/dashboard"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              İptal
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
