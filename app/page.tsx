import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Yönetim Paneli</h1>
        <p className="mb-6 text-gray-600">
          Hoş geldiniz. Bu alan çok dilli yapıdan bağımsız çalışmaktadır.
        </p>
        
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
          &larr; Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}