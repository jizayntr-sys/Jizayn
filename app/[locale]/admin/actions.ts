'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { translateText, getLanguageCode } from '@/lib/translate';
import { generateSlug } from '@/utils/slug';

// TR'deki resimleri diğer tüm locale'lere kopyala (alt text'leri çevirerek)
async function copyImagesToAllLocales(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      locales: {
        include: {
          ProductImage: { orderBy: { order: 'asc' } }
        }
      }
    }
  });

  if (!product) return;

  const trLocale = product.locales.find(l => l.locale === 'tr');
  if (!trLocale || !trLocale.ProductImage || trLocale.ProductImage.length === 0) return;

  const otherLocales = product.locales.filter(l => l.locale !== 'tr');

  for (const locale of otherLocales) {
    // Mevcut resimleri sil
    await prisma.productImage.deleteMany({
      where: { productLocaleId: locale.id }
    });

    // TR'deki resimleri kopyala ve alt text'leri çevir
    for (const image of trLocale.ProductImage) {
      const targetLang = getLanguageCode(locale.locale);
      
      // Alt text'i çevir
      const translatedAlt = await translateText({
        text: image.alt,
        from: 'tr',
        to: targetLang
      });

      // Pinterest description'ı çevir (varsa)
      const translatedPinterest = image.pinterestDescription 
        ? await translateText({
            text: image.pinterestDescription,
            from: 'tr',
            to: targetLang
          })
        : null;

      await prisma.productImage.create({
        data: {
          id: crypto.randomUUID(),
          productLocaleId: locale.id,
          url: image.url,
          alt: translatedAlt,
          pinterestDescription: translatedPinterest,
          order: image.order
        }
      });
    }
  }
}

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
      const slugTr = formData.get('slug_tr') as string;
      const sanitizedSlugTr = slugTr ? generateSlug(slugTr, 'tr') : generateSlug(nameTr, 'tr');
      
      await prisma.productLocale.updateMany({
        where: {
          productId,
          locale: 'tr',
        },
        data: {
          name: nameTr,
          slug: sanitizedSlugTr,
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
      const slugEn = formData.get('slug_en') as string;
      const sanitizedSlugEn = slugEn ? generateSlug(slugEn, 'en') : generateSlug(nameEn, 'en');
      
      await prisma.productLocale.updateMany({
        where: {
          productId,
          locale: 'en',
        },
        data: {
          name: nameEn,
          slug: sanitizedSlugEn,
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
      const newImageAlt = formData.get(`newImage_${i}_alt`) as string;
      const newImageOrder = formData.get(`newImage_${i}_order`) as string;
      const newImageFile = formData.get(`newImageFile_${i}`) as File;
      
      let finalUrl = '';
      
      // Dosya yükleme varsa
      if (newImageFile && newImageFile.size > 0) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('files', newImageFile);
          
          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
            method: 'POST',
            body: uploadFormData,
          });
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            finalUrl = uploadResult.urls?.[0] || '';
          }
        } catch (uploadError) {
          console.error('Dosya yükleme hatası:', uploadError);
        }
      } 
      // URL girişi varsa
      else if (newImageUrl && newImageUrl.trim() && !newImageUrl.startsWith('Yükleniyor:')) {
        finalUrl = newImageUrl.trim();
      }
      
      if (finalUrl) {
        // Mevcut görsel sayısını öğren
        const existingImagesCount = await prisma.productImage.count({
          where: { productLocaleId: trLocale.id },
        });

        await prisma.productImage.create({
          data: {
            id: crypto.randomUUID(),
            productLocaleId: trLocale.id,
            url: finalUrl,
            alt: newImageAlt?.trim() || `${nameTr} - Görsel ${existingImagesCount + 1}`,
            pinterestDescription: nameTr,
            order: newImageOrder ? parseInt(newImageOrder) : existingImagesCount,
          },
        });
      }
    }
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    throw new Error('Ürün güncellenemedi.');
  }

  // TR'deki resimleri diğer tüm dillere otomatik kopyala
  try {
    await copyImagesToAllLocales(productId);
  } catch (copyError) {
    console.error('Resimler kopyalanırken hata:', copyError);
    // Resim kopyalama hatası ürün güncellemeyi etkilemesin
  }

  revalidatePath('/[locale]/admin/dashboard', 'page');
  redirect('/tr/admin/dashboard');
}

// Yeni Ürün Ekleme
export async function createProduct(formData: FormData) {
  const category = formData.get('category') as string;
  const brandId = formData.get('brandId') as string;
  const isFeatured = formData.get('isFeatured') === 'on';
  const sortOrder = parseInt(formData.get('sortOrder') as string || '0');

  try {
    // Ürünü oluştur
    const product = await prisma.product.create({
      data: {
        id: crypto.randomUUID(),
        category,
        brandId,
        isFeatured,
        sortOrder,
        tags: [],
        updatedAt: new Date(), // <--- Bu satırın olduğundan %100 emin olun
      },
    });


    // TR Locale oluştur
    const nameTr = formData.get('name_tr') as string;
    const slugTr = formData.get('slug_tr') as string;
    const sanitizedSlugTr = slugTr ? generateSlug(slugTr, 'tr') : generateSlug(nameTr, 'tr');
    const descriptionTr = formData.get('description_tr') as string;
    const imageUrlTr = formData.get('imageUrl_tr') as string;

    const trLocale = await prisma.productLocale.create({
      data: {
        id: crypto.randomUUID(),
        productId: product.id,
        locale: 'tr',
        slug: sanitizedSlugTr,
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
        createdAt: new Date(), // 'now' yerine bunu kullanın
        updatedAt: new Date(), // 'now' yerine bunu kullanın
      },
    });


    // Görselleri ekle (8 adete kadar)
    for (let i = 1; i <= 8; i++) {
      const imageUrl = formData.get(`imageUrl_${i}`) as string;
      const imageAlt = formData.get(`imageAlt_${i}`) as string;
      
      if (imageUrl && imageUrl.trim()) {
        await prisma.productImage.create({
          data: {
            id: crypto.randomUUID(),
            productLocaleId: trLocale.id,
            url: imageUrl.trim(),
            alt: imageAlt && imageAlt.trim() ? imageAlt.trim() : `${nameTr} - Görsel ${i}`,
            pinterestDescription: nameTr,
            order: i - 1,
          },
        });
      }
    }

    // EN Locale oluştur (sadece TR ve EN - diğer diller lazy loading)
    let nameEn = formData.get('name_en') as string;
    let descriptionEn = formData.get('description_en') as string;
    
    // İngilizce içerik yoksa Türkçe'den çevir
    if (!nameEn || !nameEn.trim()) {
      nameEn = await translateText({ text: nameTr, from: 'tr', to: 'en' });
    }
    if (!descriptionEn || !descriptionEn.trim()) {
      descriptionEn = await translateText({ text: descriptionTr, from: 'tr', to: 'en' });
    }

    const slugEnInput = formData.get('slug_en') as string;
    const sanitizedSlugEn = slugEnInput && slugEnInput.trim() 
      ? generateSlug(slugEnInput, 'en') 
      : generateSlug(nameEn, 'en');

    const enLocale = await prisma.productLocale.create({
      data: {
        id: crypto.randomUUID(),
        productId: product.id,
        locale: 'en',
        slug: sanitizedSlugEn,
        name: nameEn,
        description: descriptionEn,
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
        metaDescription: descriptionEn.substring(0, 160),
        metaKeywords: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // TR'deki resimleri EN locale'e kopyala (alt text'leri çevirerek)
    const trImages = await prisma.productImage.findMany({
      where: { productLocaleId: trLocale.id },
      orderBy: { order: 'asc' }
    });

    for (const image of trImages) {
      const altEn = await translateText({ text: image.alt, from: 'tr', to: 'en' });
      const pinterestEn = image.pinterestDescription
        ? await translateText({ text: image.pinterestDescription, from: 'tr', to: 'en' })
        : null;

      await prisma.productImage.create({
        data: {
          id: crypto.randomUUID(),
          productLocaleId: enLocale.id,
          url: image.url,
          alt: altEn,
          pinterestDescription: pinterestEn,
          order: image.order
        }
      });
    }

  } catch (error) {
    console.error('Ürün oluşturulurken hata:', error);
    throw new Error('Ürün oluşturulamadı.');
  }

  revalidatePath('/[locale]/admin/dashboard', 'page');
  redirect('/tr/admin/dashboard');
}