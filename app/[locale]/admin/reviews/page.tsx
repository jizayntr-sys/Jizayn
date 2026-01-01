'use client';

import { useState } from 'react';
import { Check, X, Star, Info, Edit2, Save } from 'lucide-react';

// Örnek veri (Gerçekte veritabanından gelecek)
const mockPendingReviews = [
  { id: 1, product: 'El Yapımı Ahşap Kutu', author: 'Ayşe Y.', rating: 5, comment: 'Harika bir ürün, bayıldım!', date: '2024-03-20' },
  { id: 2, product: 'Masif Meşe Sehpa', author: 'Mehmet K.', rating: 4, comment: 'Kargo biraz geç geldi ama ürün kaliteli.', date: '2024-03-19' },
  { id: 3, product: 'Geometrik Duvar Sanatı', author: 'Canan T.', rating: 5, comment: 'Salonuma çok yakıştı.', date: '2024-03-18' },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockPendingReviews);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleApprove = (id: number) => {
    // Burada API isteği atılacak
    setReviews(reviews.filter(r => r.id !== id));
    alert('Yorum onaylandı! (Not: Demo modunda olduğunuz için değişiklikler veritabanına kaydedilmez)');
  };

  const handleReject = (id: number) => {
    // Burada API isteği atılacak
    setReviews(reviews.filter(r => r.id !== id));
  };

  const startEditing = (review: typeof mockPendingReviews[0]) => {
    setEditingId(review.id);
    setEditContent(review.comment);
  };

  const saveEdit = (id: number) => {
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, comment: editContent } : r
    ));
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yorum Onayları</h1>
        <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
          Bekleyen: {reviews.length}
        </span>
      </div>

      {/* Bilgilendirme Kutusu */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Demo Modu</h3>
          <p className="text-sm text-blue-700 mt-1">
            Şu an bir veritabanı bağlantısı olmadığı için bu panel <strong>simülasyon</strong> modunda çalışmaktadır. Yaptığınız onaylama/reddetme işlemleri canlı siteye yansımaz ve sayfa yenilendiğinde sıfırlanır.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Onay bekleyen yeni yorum bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.product}</h3>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-600 text-sm">{review.author}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{review.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    {editingId === review.id ? (
                      <div className="flex gap-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                          rows={3}
                        />
                        <button
                          onClick={() => saveEdit(review.id)}
                          className="self-end p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          title="Kaydet"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 relative group">
                        "{review.comment}"
                        <button
                          onClick={() => startEditing(review)}
                          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          title="Düzenle"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                      title="Onayla"
                    >
                      <Check className="w-4 h-4" />
                      <span className="hidden md:inline">Onayla</span>
                    </button>
                    <button 
                      onClick={() => handleReject(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      title="Reddet"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden md:inline">Reddet</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}