import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkDatabase() {
  console.log('=== VERİTABANI KONTROL ===\n');
  
  // Tabloları ve kayıt sayılarını kontrol et
  const brandCount = await prisma.brand.count();
  const productCount = await prisma.product.count();
  const productLocaleCount = await prisma.productLocale.count();
  const productImageCount = await prisma.productImage.count();
  const productReviewCount = await prisma.productReview.count();
  const productFaqCount = await prisma.productFaq.count();
  const productOfferCount = await prisma.productOffer.count();
  const productRatingCount = await prisma.productRating.count();
  
  console.log('📊 TABLO İSTATİSTİKLERİ:');
  console.log(`- Brand: ${brandCount} kayıt`);
  console.log(`- Product: ${productCount} kayıt`);
  console.log(`- ProductLocale: ${productLocaleCount} kayıt`);
  console.log(`- ProductImage: ${productImageCount} kayıt`);
  console.log(`- ProductReview: ${productReviewCount} kayıt`);
  console.log(`- ProductFaq: ${productFaqCount} kayıt`);
  console.log(`- ProductOffer: ${productOfferCount} kayıt`);
  console.log(`- ProductRating: ${productRatingCount} kayıt\n`);
  
  // Ürünleri detaylı göster
  if (productCount > 0) {
    console.log('📦 ÜRÜNLER:');
    const products = await prisma.product.findMany({
      include: {
        Brand: true,
        ProductLocale: true,
      }
    });
    products.forEach(p => {
      console.log(`\nID: ${p.id}`);
      console.log(`Kategori: ${p.category}`);
      console.log(`Marka: ${p.Brand.name}`);
      console.log(`Locale sayısı: ${p.ProductLocale.length}`);
      p.ProductLocale.forEach(l => {
        console.log(`  - ${l.locale}: ${l.name} (${l.slug})`);
      });
    });
  }
  
  // Yorumları göster
  if (productReviewCount > 0) {
    console.log('\n💬 YORUMLAR:');
    const reviews = await prisma.productReview.findMany({
      include: {
        ProductLocale: {
          select: { name: true, locale: true }
        }
      }
    });
    reviews.forEach(r => {
      console.log(`\nID: ${r.id.substring(0, 8)}...`);
      console.log(`Yazar: ${r.author}`);
      console.log(`Puan: ${r.reviewRating}/5`);
      console.log(`Onaylı: ${r.isApproved}`);
      console.log(`Ürün: ${r.ProductLocale.name}`);
    });
  }
  
  await prisma.$disconnect();
}

checkDatabase().catch(console.error);
