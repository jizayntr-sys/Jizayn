import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateReview } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const review = await prisma.productReview.findUnique({
    where: { id },
    include: {
      productLocale: {
        select: {
          name: true,
          locale: true,
        },
      },
    },
  });

  if (!review) {
    notFound();
  }

  return (
    <div className="pt-24 p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Link href="/tr/admin/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Geri Dön
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Yorum Düzenle</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form action={updateReview} className="space-y-6">
          <input type="hidden" name="reviewId" value={review.id} />
          
          {/* Ürün Bilgisi */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Ürün:</span> {review.productLocale.name} ({review.productLocale.locale})
            </p>
          </div>

          {/* Yazar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yazar Adı</label>
            <input
              type="text"
              name="author"
              defaultValue={review.author}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Puan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Puan (1-5)</label>
            <select
              name="reviewRating"
              defaultValue={review.reviewRating}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="1">1 Yıldız</option>
              <option value="2">2 Yıldız</option>
              <option value="3">3 Yıldız</option>
              <option value="4">4 Yıldız</option>
              <option value="5">5 Yıldız</option>
            </select>
          </div>

          {/* Yorum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yorum</label>
            <textarea
              name="reviewBody"
              defaultValue={review.reviewBody}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Kaynak */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kaynak (Opsiyonel)</label>
            <input
              type="text"
              name="reviewSource"
              defaultValue={review.reviewSource || ''}
              placeholder="Örn: Amazon, Etsy, Website"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Onay Durumu */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isApproved"
              id="isApproved"
              defaultChecked={review.isApproved}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <label htmlFor="isApproved" className="text-sm font-medium text-gray-700">Onaylı</label>
          </div>

          {/* Tarih Bilgisi */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <p><span className="font-semibold">Yayın Tarihi:</span> {new Date(review.datePublished).toLocaleDateString('tr-TR')}</p>
            <p><span className="font-semibold">Oluşturulma:</span> {new Date(review.createdAt).toLocaleDateString('tr-TR')}</p>
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
