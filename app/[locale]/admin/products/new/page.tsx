import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { createProduct } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  // Marka listesini al
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="pt-24 p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Link href="/tr/admin/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Geri Dön
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Yeni Ürün Ekle</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form action={createProduct} className="space-y-6">
          
          {/* Temel Bilgiler */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Temel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                <input
                  type="text"
                  name="category"
                  defaultValue="decor"
                  placeholder="Örn: decor, furniture"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marka *</label>
                <select
                  name="brandId"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                >
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Öne Çıkan Ürün</label>
              </div>
            </div>
          </div>

          {/* Türkçe İçerik */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Türkçe İçerik</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı (TR) *</label>
                <input
                  type="text"
                  name="name_tr"
                  placeholder="Örn: El Yapımı Ahşap Duvar Saati"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (TR) *</label>
                <input
                  type="text"
                  name="slug_tr"
                  placeholder="Örn: el-yapimi-ahsap-duvar-saati"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">URL dostu format (küçük harf, tire ile ayrılmış)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (TR) *</label>
                <textarea
                  name="description_tr"
                  rows={4}
                  placeholder="Ürün detaylı açıklaması..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ölçüler</label>
                  <input
                    type="text"
                    name="dimensions_tr"
                    placeholder="Örn: 30cm x 30cm x 5cm"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Malzemeler</label>
                  <input
                    type="text"
                    name="materials_tr"
                    placeholder="Örn: Ceviz Ahşabı, Metal"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    name="sku_tr"
                    placeholder="Örn: JZN-WC-001-TR"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Fiyat (TRY) *</label>
                  <input
                    type="number"
                    name="priceMin_tr"
                    step="0.01"
                    defaultValue="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Fiyat (TRY) *</label>
                  <input
                    type="number"
                    name="priceMax_tr"
                    step="0.01"
                    defaultValue="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Durumu</label>
                  <select
                    name="availability_tr"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="InStock">Stokta</option>
                    <option value="OutOfStock">Stokta Yok</option>
                    <option value="PreOrder">Ön Sipariş</option>
                    <option value="BackOrder">Sipariş Üzerine</option>
                  </select>
                </div>
              </div>

              {/* Görseller - 8 adet */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Görselleri (En az 1, En fazla 8)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Görselleri public/images/products klasörüne yükleyin ve yolunu girin
                </p>
                
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={num}>
                    <label className="block text-xs text-gray-600 mb-1">Görsel {num} {num === 1 && '*'}</label>
                    <input
                      type="text"
                      name={`imageUrl_${num}`}
                      placeholder={`Örn: /images/products/urun-${num}.jpg`}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      required={num === 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* İngilizce İçerik */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">İngilizce İçerik (Opsiyonel)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı (EN)</label>
                <input
                  type="text"
                  name="name_en"
                  placeholder="Ex: Handmade Wooden Wall Clock"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (EN)</label>
                <input
                  type="text"
                  name="slug_en"
                  placeholder="Ex: handmade-wooden-wall-clock"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (EN)</label>
                <textarea
                  name="description_en"
                  rows={4}
                  placeholder="Product description..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex gap-4 justify-end">
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
              Ürün Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
