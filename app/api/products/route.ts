import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/data/products';

// GET /api/products - Tüm ürünleri listele (opsiyonel locale filtresi)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale');
    const products = await getAllProducts(locale || undefined);
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Ürünler alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// POST /api/products - Yeni ürün oluştur
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Veritabanı desteği kaldırıldı. Bu endpoint salt-okunur modda.' },
    { status: 405 }
  );
}

