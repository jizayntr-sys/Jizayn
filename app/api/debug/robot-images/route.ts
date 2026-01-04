import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // EN locale robot ürünü
    const enLocale = await prisma.productLocale.findUnique({
      where: {
        locale_slug: {
          locale: 'en',
          slug: 'handmade-wooden-robot-desk-organizer'
        }
      },
      select: {
        locale: true,
        slug: true,
        name: true,
        images: {
          select: { url: true, alt: true, order: true }
        }
      }
    });

    // TR locale robot ürünü
    const trLocale = await prisma.productLocale.findUnique({
      where: {
        locale_slug: {
          locale: 'tr',
          slug: 'el-yapimi-ahsap-robot-masa-duzenleyici'
        }
      },
      select: {
        locale: true,
        slug: true,
        name: true,
        images: {
          select: { url: true, alt: true, order: true }
        }
      }
    });

    return NextResponse.json({
      en: enLocale,
      tr: trLocale
    });
  } catch (error) {
    console.error('Error checking images:', error);
    return NextResponse.json(
      { error: 'Failed to check images' },
      { status: 500 }
    );
  }
}
