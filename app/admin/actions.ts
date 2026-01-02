'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Yorum Onaylama
export async function approveReview(reviewId: string) {
  try {
    await prisma.productReview.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });
    // İşlem bitince dashboard'u yenile ki güncel veriyi görelim
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Yorum onaylanırken hata:', error);
    throw new Error('Yorum onaylanamadı.');
  }
}

// Yorum Silme
export async function deleteReview(reviewId: string) {
  try {
    await prisma.productReview.delete({
      where: { id: reviewId },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Yorum silinirken hata:', error);
    throw new Error('Yorum silinemedi.');
  }
}

// Ürün Silme
export async function deleteProduct(productId: string) {
  try {
    // Cascade delete sayesinde ürüne bağlı locale, resim ve yorumlar da silinir
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    throw new Error('Ürün silinemedi.');
  }
}

// Yeni Ürün Ekleme
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const brandId = formData.get('brandId') as string;
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string;
  
  // Slug oluşturma (Basitçe boşlukları tireye çevirir)
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  try {
    await prisma.product.create({
      data: {
        category,
        brandId,
        isFeatured: false,
        locales: {
          create: {
            locale: 'tr', // Varsayılan olarak Türkçe ekliyoruz
            name,
            slug,
            description,
            priceMin: price,
            priceMax: price,
            priceCurrency: 'TRY',
            availability: 'InStock',
            metaTitle: name,
            metaDescription: description.substring(0, 160),
            materials: 'Ahşap', // Varsayılan değerler (formdan da alınabilir)
            dimensions: 'Standart',
            sku: `SKU-${Date.now()}`, // Otomatik SKU
          }
        }
      },
    });
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    throw new Error('Ürün eklenemedi.');
  }

  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard');
}