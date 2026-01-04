import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Ürün Sıralaması - Admin',
  description: 'Ürün sırasını düzenle',
};

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      locales: {
        where: { locale: 'tr' },
        select: { name: true },
      },
    },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return products;
}

async function moveProduct(formData: FormData) {
  'use server';
  
  const productId = formData.get('productId') as string;
  const direction = formData.get('direction') as 'up' | 'down';
  
  const products = await prisma.product.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
  
  const currentIndex = products.findIndex(p => p.id === productId);
  
  if (direction === 'up' && currentIndex > 0) {
    await prisma.product.update({
      where: { id: products[currentIndex].id },
      data: { sortOrder: currentIndex },
    });
    await prisma.product.update({
      where: { id: products[currentIndex - 1].id },
      data: { sortOrder: currentIndex + 1 },
    });
  } else if (direction === 'down' && currentIndex < products.length - 1) {
    await prisma.product.update({
      where: { id: products[currentIndex].id },
      data: { sortOrder: currentIndex + 2 },
    });
    await prisma.product.update({
      where: { id: products[currentIndex + 1].id },
      data: { sortOrder: currentIndex + 1 },
    });
  }
  
  revalidatePath('/admin/product-order');
  revalidatePath('/products');
  redirect('/tr/admin/product-order');
}

export default async function ProductOrderPage() {
  const products = await getProducts();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ürün Sıralaması</h1>
        <p className="text-gray-600">
          Ürünleri yukarı/aşağı butonlarıyla sıralayın. En üstteki ürün, ürünler sayfasında ilk sırada görünecektir.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 border-b last:border-b-0"
          >
            <div className="flex-shrink-0 w-12 text-center">
              <span className="text-lg font-bold text-gray-700">#{index + 1}</span>
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {product.locales[0]?.name || 'İsimsiz Ürün'}
              </p>
              <p className="text-sm text-gray-500">
                Kategori: {product.category}
              </p>
            </div>

            <div className="flex gap-2">
              <form action={moveProduct}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  ↑ Yukarı
                </button>
              </form>
              
              <form action={moveProduct}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === products.length - 1}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  ↓ Aşağı
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
