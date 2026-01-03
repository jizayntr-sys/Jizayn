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
    // [locale] dinamik olduğu için path'i bu şekilde veriyoruz
    revalidatePath('/[locale]/admin/dashboard', 'page');
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
    revalidatePath('/[locale]/admin/dashboard', 'page');
  } catch (error) {
    console.error('Yorum silinirken hata:', error);
    throw new Error('Yorum silinemedi.');
  }
}

// Ürün Silme
export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath('/[locale]/admin/dashboard', 'page');
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    throw new Error('Ürün silinemedi.');
  }
}

// Yorum Güncelleme
export async function updateReview(formData: FormData) {
  const reviewId = formData.get('reviewId') as string;
  const author = formData.get('author') as string;
  const reviewRating = parseInt(formData.get('reviewRating') as string);
  const reviewBody = formData.get('reviewBody') as string;
  const reviewSourceRaw = formData.get('reviewSource') as string;
  const reviewSource = reviewSourceRaw && reviewSourceRaw.trim() !== '' ? reviewSourceRaw : null;
  const isApproved = formData.get('isApproved') === 'on';

  console.log('Update Review Data:', { reviewId, author, reviewRating, reviewBody, reviewSource, isApproved });

  if (!reviewId) {
    throw new Error('Review ID bulunamadı');
  }

  try {
    await prisma.productReview.update({
      where: { id: reviewId },
      data: {
        author,
        reviewRating,
        reviewBody,
        reviewSource,
        isApproved,
      },
    });
  } catch (error) {
    console.error('Yorum güncellenirken detaylı hata:', error);
    throw new Error(`Yorum güncellenemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }

  revalidatePath('/[locale]/admin/dashboard', 'page');
  redirect('/tr/admin/dashboard');
}

// Ürün Güncelleme
export async function updateProduct(formData: FormData) {
  const productId = formData.get('productId') as string;
  const category = formData.get('category') as string;
  const isFeatured = formData.get('isFeatured') === 'on';

  try {
    // Ürünü güncelle
    await prisma.product.update({
      where: { id: productId },
      data: {
        category,
        isFeatured,
      },
    });

    // TR Locale'i bul
    const trLocale = await prisma.productLocale.findFirst({
      where: {
        productId,
        locale: 'tr',
      },
    });

    if (!trLocale) {
      throw new Error('Türkçe locale bulunamadı.');
    }

    // TR Locale güncelle
    const nameTr = formData.get('name_tr') as string;
    if (nameTr) {
      await prisma.productLocale.updateMany({
        where: {
          productId,
          locale: 'tr',
        },
        data: {
          name: nameTr,
          slug: formData.get('slug_tr') as string,
          description: formData.get('description_tr') as string,
          sku: formData.get('sku_tr') as string,
          availability: formData.get('availability_tr') as string,
          priceMin: parseFloat(formData.get('priceMin_tr') as string || '0'),
          priceMax: parseFloat(formData.get('priceMax_tr') as string || '0'),
        },
      });
    }

    // EN Locale güncelle
    const nameEn = formData.get('name_en') as string;
    if (nameEn) {
      await prisma.productLocale.updateMany({
        where: {
          productId,
          locale: 'en',
        },
        data: {
          name: nameEn,
          slug: formData.get('slug_en') as string,
          description: formData.get('description_en') as string,
          sku: formData.get('sku_en') as string,
        },
      });
    }

    // Mevcut görselleri güncelle veya sil
    let index = 0;
    while (formData.has(`existingImage_${index}_id`)) {
      const imageId = formData.get(`existingImage_${index}_id`) as string;
      const imageUrl = formData.get(`existingImage_${index}_url`) as string;
      const imageAlt = formData.get(`existingImage_${index}_alt`) as string;
      const imageOrder = formData.get(`existingImage_${index}_order`) as string;
      const shouldDelete = formData.get(`existingImage_${index}_delete`) === 'on';
      
      if (shouldDelete) {
        // Görseli sil
        await prisma.productImage.delete({
          where: { id: imageId },
        });
      } else if (imageUrl && imageUrl.trim()) {
        // Görseli güncelle (url, alt ve order)
        await prisma.productImage.update({
          where: { id: imageId },
          data: {
            url: imageUrl.trim(),
            alt: imageAlt?.trim() || `${nameTr} - Görsel ${index + 1}`,
            order: imageOrder ? parseInt(imageOrder) : index,
          },
        });
      }
      index++;
    }

    // Yeni görseller ekle
    for (let i = 1; i <= 8; i++) {
      const newImageUrl = formData.get(`newImage_${i}`) as string;
      if (newImageUrl && newImageUrl.trim()) {
        // Mevcut görsel sayısını öğren
        const existingImagesCount = await prisma.productImage.count({
          where: { productLocaleId: trLocale.id },
        });

        await prisma.productImage.create({
          data: {
            productLocaleId: trLocale.id,
            url: newImageUrl.trim(),
            alt: `${nameTr} - Görsel ${existingImagesCount + 1}`,
            pinterestDescription: nameTr,
            order: existingImagesCount,
          },
        });
      }
    }
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    throw new Error('Ürün güncellenemedi.');
  }

  revalidatePath('/[locale]/admin/dashboard', 'page');
  redirect('/tr/admin/dashboard');
}

// Yeni Ürün Ekleme
export async function createProduct(formData: FormData) {
  const category = formData.get('category') as string;
  const brandId = formData.get('brandId') as string;
  const isFeatured = formData.get('isFeatured') === 'on';

  try {
    // Ürünü oluştur
    const product = await prisma.product.create({
      data: {
        category,
        brandId,
        isFeatured,
        tags: [],
      },
    });

    // TR Locale oluştur
    const nameTr = formData.get('name_tr') as string;
    const slugTr = formData.get('slug_tr') as string;
    const descriptionTr = formData.get('description_tr') as string;
    const imageUrlTr = formData.get('imageUrl_tr') as string;

    const trLocale = await prisma.productLocale.create({
      data: {
        productId: product.id,
        locale: 'tr',
        slug: slugTr,
        name: nameTr,
        description: descriptionTr,
        dimensions: formData.get('dimensions_tr') as string || '',
        materials: formData.get('materials_tr') as string || '',
        specifications: [],
        sku: formData.get('sku_tr') as string || '',
        gtin: null,
        availability: formData.get('availability_tr') as string || 'InStock',
        priceMin: parseFloat(formData.get('priceMin_tr') as string || '0'),
        priceMax: parseFloat(formData.get('priceMax_tr') as string || '0'),
        priceCurrency: 'TRY',
        amazonUrl: null,
        etsyUrl: null,
        video: null,
        metaTitle: nameTr,
        metaDescription: descriptionTr.substring(0, 160),
        metaKeywords: [],
      },
    });

    // Görselleri ekle (8 adete kadar)
    for (let i = 1; i <= 8; i++) {
      const imageUrl = formData.get(`imageUrl_${i}`) as string;
      if (imageUrl && imageUrl.trim()) {
        await prisma.productImage.create({
          data: {
            productLocaleId: trLocale.id,
            url: imageUrl.trim(),
            alt: `${nameTr} - Görsel ${i}`,
            pinterestDescription: nameTr,
            order: i - 1,
          },
        });
      }
    }

    // EN Locale oluştur (eğer verilmişse)
    const nameEn = formData.get('name_en') as string;
    if (nameEn) {
      const slugEn = formData.get('slug_en') as string;
      const descriptionEn = formData.get('description_en') as string;

      const enLocale = await prisma.productLocale.create({
        data: {
          productId: product.id,
          locale: 'en',
          slug: slugEn || slugTr,
          name: nameEn,
          description: descriptionEn || descriptionTr,
          dimensions: formData.get('dimensions_tr') as string || '',
          materials: formData.get('materials_tr') as string || '',
          specifications: [],
          sku: formData.get('sku_tr') as string || '',
          gtin: null,
          availability: 'InStock',
          priceMin: parseFloat(formData.get('priceMin_tr') as string || '0'),
          priceMax: parseFloat(formData.get('priceMax_tr') as string || '0'),
          priceCurrency: 'USD',
          amazonUrl: null,
          etsyUrl: null,
          video: null,
          metaTitle: nameEn,
          metaDescription: (descriptionEn || descriptionTr).substring(0, 160),
          metaKeywords: [],
        },
      });
    }

  } catch (error) {
    console.error('Ürün oluşturulurken hata:', error);
    throw new Error('Ürün oluşturulamadı.');
  }

  revalidatePath('/[locale]/admin/dashboard', 'page');
  redirect('/tr/admin/dashboard');
}