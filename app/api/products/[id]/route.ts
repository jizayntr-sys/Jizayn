import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transformProduct } from '@/lib/prisma-helpers';

// GET /api/products/[id] - Tek bir ürünü getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'tr';

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Brand: true,
        ProductLocale: {
          where: { locale },
          include: {
            ProductImage: {
              orderBy: { order: 'asc' },
            },
            ProductReview: {
              orderBy: { datePublished: 'desc' },
            },
            ProductFaq: {
              orderBy: { order: 'asc' },
            },
            ProductOffer: true,
            ProductRating: true,
          },
        },
      },
    });

    if (!product || product.ProductLocale.length === 0) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(transformProduct(product), { status: 200 });
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
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      category,
      tags,
      brand,
      brandId,
      locales,
      sortOrder,
    } = body;

    // Ürünün var olup olmadığını kontrol et
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    // Brand'i bul veya oluştur
    let targetBrandId = brandId || existingProduct.brandId;
    if (brand) {
      let existingBrand = await prisma.brand.findFirst({ where: { name: brand.name } });
      if (!existingBrand) {
        existingBrand = await prisma.brand.create({
          data: {
            name: brand.name,
            url: brand.url,
            logo: brand.logo,
          },
        });
      }
      targetBrandId = existingBrand.id;
    }

    // Locales formatını kontrol et - object ise array'e çevir
    let localesArray = locales;
    if (locales && typeof locales === 'object' && !Array.isArray(locales)) {
      localesArray = Object.entries(locales).map(([locale, localeData]: [string, any]) => ({
        locale,
        ...localeData,
      }));
    }

    // Ürünü güncelle
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(category && { category }),
        ...(tags && { tags }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(targetBrandId && { brandId: targetBrandId }),
        ...(localesArray && Array.isArray(localesArray) && {
          locales: {
            upsert: localesArray.map((localeData: any) => ({
              where: {
                productId_locale: {
                  productId: id,
                  locale: localeData.locale,
                },
              },
              update: {
                slug: localeData.slug,
                name: localeData.name,
                description: localeData.description,
                dimensions: localeData.dimensions,
                materials: localeData.materials,
                specifications: localeData.specifications || [],
                sku: localeData.sku,
                gtin: localeData.gtin,
                availability: localeData.availability || 'InStock',
                priceMin: localeData.priceRange?.min || 0,
                priceMax: localeData.priceRange?.max || 0,
                priceCurrency: localeData.priceRange?.currency || 'TRY',
                amazonUrl: localeData.amazonUrl,
                etsyUrl: localeData.etsyUrl,
                video: localeData.video,
                metaTitle: localeData.metaTitle || localeData.name,
                metaDescription: localeData.metaDescription || '',
                metaKeywords: localeData.metaKeywords || [],
                images: {
                  deleteMany: {}, // Mevcut görselleri sil
                  create: (localeData.images || []).map((img: any, index: number) => ({
                    url: img.url,
                    alt: img.alt,
                    pinterestDescription: img.pinterestDescription,
                    order: index,
                  })),
                },
              },
              create: {
                locale: localeData.locale,
                slug: localeData.slug,
                name: localeData.name,
                description: localeData.description,
                dimensions: localeData.dimensions,
                materials: localeData.materials,
                specifications: localeData.specifications || [],
                sku: localeData.sku,
                gtin: localeData.gtin,
                availability: localeData.availability || 'InStock',
                priceMin: localeData.priceRange?.min || 0,
                priceMax: localeData.priceRange?.max || 0,
                priceCurrency: localeData.priceRange?.currency || 'TRY',
                amazonUrl: localeData.amazonUrl,
                etsyUrl: localeData.etsyUrl,
                video: localeData.video,
                metaTitle: localeData.metaTitle || localeData.name,
                metaDescription: localeData.metaDescription || '',
                metaKeywords: localeData.metaKeywords || [],
                images: {
                  create: (localeData.images || []).map((img: any, index: number) => ({
                    url: img.url,
                    alt: img.alt,
                    pinterestDescription: img.pinterestDescription,
                    order: index,
                  })),
                },
              },
            })),
          },
        }),
      },
      include: {
        Brand: true,
        ProductLocale: {
          include: {
            ProductImage: { orderBy: { order: 'asc' } },
            ProductReview: true,
            ProductFaq: { orderBy: { order: 'asc' } },
            ProductOffer: true,
            ProductRating: true,
          },
        },
      },
    });

    // Ürünü formatla
    return NextResponse.json(transformProduct(product), { status: 200 });
  } catch (error: any) {
    console.error('Product PUT error:', error);
    
    // Unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor. Lütfen farklı bir slug kullanın.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Ürün güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Ürünü sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Ürünün var olup olmadığını kontrol et
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı.' },
        { status: 404 }
      );
    }

    // Ürünü sil (cascade delete ile ilgili tüm veriler silinir)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Ürün başarıyla silindi.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json(
      { error: 'Ürün silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
