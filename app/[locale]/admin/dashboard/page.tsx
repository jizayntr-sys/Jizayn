import { Users, ShoppingBag, MessageSquare, TrendingUp } from 'lucide-react';
import { products } from '@/data/products';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Genel Bakış</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Toplam Ürün</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          <span className="text-green-600 text-sm font-medium">Güncel</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Bekleyen Yorumlar</h3>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">3</div>
          <span className="text-yellow-600 text-sm font-medium">Onay bekliyor</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Toplam Ziyaretçi</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">1,234</div>
          <span className="text-green-600 text-sm font-medium">+12% artış</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Dönüşüm Oranı</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">2.4%</div>
          <span className="text-gray-500 text-sm font-medium">Geçen aya göre sabit</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Son Aktiviteler</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600">Yeni bir yorum eklendi: <span className="font-medium text-gray-900">Masif Meşe Sehpa</span></p>
            <span className="ml-auto text-xs text-gray-400">2 dk önce</span>
          </div>
          <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-sm text-gray-600">Stok güncellemesi yapıldı: <span className="font-medium text-gray-900">Dekoratif Kutu</span></p>
            <span className="ml-auto text-xs text-gray-400">1 saat önce</span>
          </div>
        </div>
      </div>
    </div>
  );
}