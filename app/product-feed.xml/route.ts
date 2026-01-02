import { NextResponse } from 'next/server';
import { getAllProducts } from '@/data/products';
import { routing } from '@/i18n/routing';

// Force dynamic rendering - don't try to prerender at build time
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

const baseUrl = 'https://www.jizayn.com';

// Helper function to escape XML special characters
const escapeXml = (str: string | undefined | null): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Convert availability to Google Shopping format
 */
function getGoogleAvailability(
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder'
): string {
  switch (availability) {
    case 'InStock':
      return 'in stock';
    case 'OutOfStock':
      return 'out of stock';
    case 'PreOrder':
      return 'preorder';
    case 'BackOrder':
      return 'backorder';
    default:
      return 'in stock';
  }
}

/**
 * Get Google Product Category ID based on product category
 * https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 */
function getGoogleProductCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'decor': 'Home & Garden > Decor',
    'furniture': 'Home & Garden > Furniture',
    'accessory': 'Home & Garden > Decor > Home Decor Accessories',
  };

  return categoryMap[category] || 'Home & Garden > Decor';
}

/**
 * Generate Google Shopping Feed XML
 */
export async function GET() {
  const products = await getAllProducts('en'); // Feed is generated using English data

  const items = products
    .map((product) => {
      const productData = product.locales.en;
      if (!productData) return null;

      // Ana görsel
      const mainImage = productData.images[0];
      if (!mainImage) return null;

      // Determine price and link from offers, with fallbacks
      const offer = productData.amazonOffer || productData.etsyOffer;
      let price: number;
      let currency: string;

      if (offer?.price) {
        price = offer.price;
        currency = offer.priceCurrency || 'USD';
      } else if (productData.priceRange?.min) {
        price = productData.priceRange.min;
        currency = productData.priceRange.currency;
      } else {
        return null; // Skip product if no price is available
      }

      const formattedPrice = `${price.toFixed(2)} ${currency}`;
      const link = offer?.url || productData.amazonUrl || productData.etsyUrl || `${baseUrl}/en/products/${productData.slug}`;

      const imageUrl = mainImage.url.startsWith('http')
        ? mainImage.url
        : `${baseUrl}${mainImage.url}`;

      return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(productData.name)}</g:title>
      <g:description>${escapeXml(
        productData.description.substring(0, 5000)
      )}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      ${productData.images.length > 1
        ? productData.images
            .slice(1, 11)
            .map(
              (img) =>
                `<g:additional_image_link>${escapeXml(
                  img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
                )}</g:additional_image_link>`
            )
            .join('\n      ')
        : ''}
      <g:availability>${getGoogleAvailability(
        productData.availability || productData.amazonOffer?.availability
      )}</g:availability>
      <g:price>${escapeXml(formattedPrice)}</g:price>
      <g:brand>${escapeXml(product.brand?.name || 'Jizayn')}</g:brand>
      <g:condition>new</g:condition>
      <g:product_type>${escapeXml(getGoogleProductCategory(product.category))}</g:product_type>
      <g:mpn>${escapeXml(productData.sku)}</g:mpn>
      ${productData.gtin ? `<g:gtin>${escapeXml(productData.gtin)}</g:gtin>` : '<g:identifier_exists>no</g:identifier_exists>'}
    </item>`;
    })
    .filter((item) => item !== null)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Jizayn - Handcrafted Wooden Decorative Products</title>
    <link>${baseUrl}</link>
    <description>Handcrafted wooden decorative products from Jizayn</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
