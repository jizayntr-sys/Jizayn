import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Kumiko ürünü alt text'lerini günceller
 * GET: http://localhost:3000/api/admin/update-alt-texts
 */
export async function GET() {
  try {
    console.log('🔍 Alt text güncelleme başlıyor...');

    // Türkçe versiyonu
    const kumikoTr = await prisma.productLocale.findFirst({
      where: {
        slug: 'el-yapimi-kumiko-ahsap-masa-lambasi',
        locale: 'tr',
      },
      include: {
        ProductImage: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!kumikoTr) {
      return NextResponse.json(
        { error: 'Kumiko TR ürünü bulunamadı' },
        { status: 404 }
      );
    }

    // Alt text mapping - order numarasına göre
    const altTextsByOrder: Record<number, { tr: string; en: string }> = {
      0: {
        tr: 'El Yapımı Kumiko Ahşap Masa Lambası - Ana Görünüm, Geleneksel Japon Kumiko Tekniği ile İşlenmiş Geometrik Desenli Dekoratif Aydınlatma',
        en: 'Handmade Kumiko Wooden Table Lamp - Main View, Traditional Japanese Kumiko Technique with Geometric Pattern Decorative Lighting',
      },
      1: {
        tr: 'Kumiko Masa Lambası - Yakın Çekim, Geleneksel Geometrik Ahşap İşçiliği Detay Görünümü ve Doğal Ahşap Dokusu',
        en: 'Kumiko Table Lamp - Close-up View, Traditional Geometric Wooden Craftsmanship Detail and Natural Wood Texture',
      },
      3: {
        tr: 'Kumiko Tekniği Ahşap Masa Lambası - Yatak Odası ve Oturma Odası için Modern Tasarım Gece Lambası, Yan Görünüm',
        en: 'Kumiko Technique Wooden Table Lamp - Modern Design Night Lamp for Bedroom and Living Room, Side View',
      },
      4: {
        tr: 'Kumiko Abajur Masa Lambası - El Yapımı Ahşap Geometrik Desen Detayı, Çalışma Masası Aydınlatması için İdeal',
        en: 'Kumiko Table Lamp Shade - Handmade Wooden Geometric Pattern Detail, Ideal for Desk Lighting',
      },
      5: {
        tr: 'Kumiko Gece Lambası - Sıcak Işıklı Ahşap Masa Lambası, Yatak Odası Dekoratif Aydınlatma Ürünü, Atmosferik Görünüm',
        en: 'Kumiko Night Lamp - Warm Light Wooden Table Lamp, Bedroom Decorative Lighting Product, Atmospheric View',
      },
      6: {
        tr: 'El Yapımı Kumiko Masa Lambası - Gece Kullanımı, LED Uyumlu Dekoratif Aydınlatma, Sıcak Atmosfer Oluşturucu',
        en: 'Handmade Kumiko Table Lamp - Night Use, LED Compatible Decorative Lighting, Creating Warm Atmosphere',
      },
    };

    const updates = [];

    // TR resimleri güncelle
    for (const image of kumikoTr.ProductImage) {
      const newAlt = altTextsByOrder[image.order]?.tr;

      if (newAlt && image.alt !== newAlt) {
        await prisma.productImage.update({
          where: { id: image.id },
          data: { alt: newAlt },
        });

        updates.push({
          locale: 'tr',
          order: image.order,
          filename: image.url.split('/').pop(),
          oldAlt: image.alt || '(boş)',
          newAlt,
        });
      }
    }

    // İngilizce versiyonu
    const kumikoEn = await prisma.productLocale.findFirst({
      where: {
        slug: {
          contains: 'kumiko',
        },
        locale: 'en',
      },
      include: {
        ProductImage: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (kumikoEn) {
      for (const image of kumikoEn.ProductImage) {
        const newAlt = altTextsByOrder[image.order]?.en;

        if (newAlt && image.alt !== newAlt) {
          await prisma.productImage.update({
            where: { id: image.id },
            data: { alt: newAlt },
          });

          updates.push({
            locale: 'en',
            order: image.order,
            filename: image.url.split('/').pop(),
            oldAlt: image.alt || '(empty)',
            newAlt,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updates.length} resim alt text'i güncellendi`,
      updates,
    });
  } catch (error: any) {
    console.error('❌ Hata:', error);
    return NextResponse.json(
      { error: error.message || 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}
