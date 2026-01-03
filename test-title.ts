// Quick test to see the enhanced titles
import { getProductBySlug } from '@/data/products';
import { getTranslations } from 'next-intl/server';

async function testTitles() {
  const products = [
    { slug: 'masif-mese-yan-sehpa', locale: 'tr' },
    { slug: 'kumikomodelA', locale: 'tr' },
  ];

  for (const { slug, locale } of products) {
    const product = await getProductBySlug(slug, locale);
    if (!product) {
      console.log(`Product not found: ${slug}`);
      continue;
    }

    const productData = product.locales[locale as keyof typeof product.locales];
    const tProducts = await getTranslations({ locale, namespace: 'productsPage' });
    const categoryTranslationKey = `categories.${product.category}` as any;
    const categoryName = tProducts(categoryTranslationKey);
    
    const firstMaterial = productData.materials ? productData.materials.split(',')[0].trim() : '';
    
    const seoTitle = locale === 'tr'
      ? `${productData.name} - ${categoryName}${firstMaterial ? ` | ${firstMaterial}` : ' | El Yapımı Ahşap'}`
      : `${productData.name} - ${categoryName}${firstMaterial ? ` | ${firstMaterial}` : ' | Handmade Wood'}`;

    const finalTitle = seoTitle.length > 60 ? productData?.name : seoTitle;
    
    console.log(`\nSlug: ${slug}`);
    console.log(`Product Name: ${productData.name}`);
    console.log(`Category: ${categoryName}`);
    console.log(`First Material: ${firstMaterial}`);
    console.log(`SEO Title: ${seoTitle}`);
    console.log(`Final Title: ${finalTitle} | Jizayn`);
    console.log(`Title Length: ${(finalTitle + ' | Jizayn').length} characters`);
  }
}

testTitles().catch(console.error);
