import React from 'react';

interface ProductJsonLdProps {
  product: {
    name: string;
    description: string;
    images: { url: string }[];
    priceRange: {
      min: number;
      currency: string;
    };
  };
  url: string;
}

export default function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => 
      img.url.startsWith('http') ? img.url : `https://www.jizayn.com${img.url}`
    ),
    url: url,
    offers: {
      '@type': 'Offer',
      price: product.priceRange.min,
      priceCurrency: product.priceRange.currency,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}