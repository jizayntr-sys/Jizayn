'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminUtilitiesPage() {
  const [slugResult, setSlugResult] = useState<any>(null);
  const [imageResult, setImageResult] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const generateSlugs = async () => {
    setLoading('slugs');
    try {
      const res = await fetch('/api/admin/generate-slugs', { method: 'POST' });
      const data = await res.json();
      setSlugResult(data);
    } catch (error) {
      setSlugResult({ error: 'Hata oluştu' });
    } finally {
      setLoading(null);
    }
  };

  const copyImages = async () => {
    setLoading('images');
    try {
      const res = await fetch('/api/admin/copy-images', { method: 'POST' });
      const data = await res.json();
      setImageResult(data);
    } catch (error) {
      setImageResult({ error: 'Hata oluştu' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tr/admin/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Admin Panele Dön
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Veritabanı Yardımcı Araçları</h1>

        <div className="space-y-6">
          {/* Slug Oluşturucu */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Otomatik Slug Oluştur</h2>
            <p className="text-gray-600 mb-4">
              Tüm ürünler için ürün adlarından otomatik olarak SEO-friendly slug'lar oluşturur.
              Türkçe, Rusça, Arapça gibi özel karakterleri düzgün dönüştürür.
            </p>
            <button
              onClick={generateSlugs}
              disabled={loading === 'slugs'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading === 'slugs' ? 'İşleniyor...' : 'Slug\'ları Oluştur'}
            </button>

            {slugResult && (
              <div className={`mt-4 p-4 rounded ${slugResult.error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(slugResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Resim Kopyalayıcı */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Resimleri Tüm Dillere Kopyala</h2>
            <p className="text-gray-600 mb-4">
              Türkçe'deki ürün resimlerini diğer tüm dillere (EN, FR, DE, RU, vb.) kopyalar.
              <strong className="text-orange-600"> Mevcut resimlerin üzerine yazar!</strong>
            </p>
            <button
              onClick={copyImages}
              disabled={loading === 'images'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading === 'images' ? 'İşleniyor...' : 'Resimleri Kopyala'}
            </button>

            {imageResult && (
              <div className={`mt-4 p-4 rounded ${imageResult.error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(imageResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Bilgi Kutusu */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Kullanım İpuçları</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>Slug oluşturma işlemini yeni ürün ekledikten sonra çalıştırın</li>
              <li><strong>Resim kopyalama işlemi diğer dillerdeki mevcut resimleri siler ve TR'deki resimleri kopyalar</strong></li>
              <li>Her iki işlem de güvenli bir şekilde birden fazla kez çalıştırılabilir</li>
              <li>Yeni dil ekledikten sonra bu butona basarak resimleri senkronize edin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
