import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/data/products';

// GET /api/products/[id] - Tek bir ürünü getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json(
      { error: 'Ürün alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Ürünü güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json(
    { error: 'Veritabanı desteği kaldırıldı. Bu endpoint salt-okunur modda.' },
    { status: 405 }
  );
}

// DELETE /api/products/[id] - Ürünü sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json(
    { error: 'Veritabanı desteği kaldırıldı. Bu endpoint salt-okunur modda.' },
    { status: 405 }
  );
}
