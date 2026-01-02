import 'dotenv/config';
import { prisma } from './lib/prisma';

async function checkRLS() {
  try {
    // RLS durumunu kontrol et
    const result = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('Brand', 'Product', 'ProductLocale', 'ProductReview', 'ProductImage')
      ORDER BY tablename;
    `;
    
    console.log('📋 RLS (Row Level Security) Durumu:\n');
    console.log(result);
    
    // Tablo sayılarını göster
    const counts = await prisma.$queryRaw`
      SELECT 
        'Brand' as table_name, COUNT(*) as count FROM "Brand"
      UNION ALL
      SELECT 'Product', COUNT(*) FROM "Product"
      UNION ALL
      SELECT 'ProductLocale', COUNT(*) FROM "ProductLocale"
      UNION ALL
      SELECT 'ProductReview', COUNT(*) FROM "ProductReview"
      UNION ALL
      SELECT 'ProductImage', COUNT(*) FROM "ProductImage";
    `;
    
    console.log('\n📊 Tablo Kayıt Sayıları:');
    console.log(counts);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRLS();
