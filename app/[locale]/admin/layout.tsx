import { Link } from '@/i18n/navigation';
import { LayoutDashboard, MessageSquare, Package, Settings, LogOut } from 'lucide-react';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-wider">JIZAYN<span className="text-indigo-500">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Genel Bakış
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <Package className="w-5 h-5" />
            Ürün Yönetimi
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5" />
            Yorum Onayları
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            Ayarlar
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}