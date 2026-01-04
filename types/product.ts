export type Availability = 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder';

export interface ProductImage {
  url: string;
  alt: string;
  pinterestDescription?: string;
}

export interface ProductOffer {
  url: string;
  availability: Availability;
  price: number;
  priceCurrency: string;
  sku?: string;
  gtin?: string;
}

export interface ProductReview {
  author: string;
  datePublished: string;
  reviewBody: string;
  reviewRating: number;
  reviewSource?: 'Amazon' | 'Etsy' | 'Website';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductLocaleData {
  slug: string;
  name: string;
  description: string;
  images: ProductImage[];
  video?: string;
  dimensions: string;
  materials: string;
  specifications: string[];
  sku: string;
  gtin?: string;
  availability: Availability;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  amazonUrl?: string;
  amazonOffer?: ProductOffer;
  etsyUrl?: string;
  etsyOffer?: ProductOffer;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
  reviews?: ProductReview[];
  faq?: FaqItem[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export interface Product {
  id: string;
  category: string;
  tags: string[];
  brand: {
    name: string;
    url: string;
    logo: string;
  };
  locales: {
    [key: string]: ProductLocaleData;
  };
  isFeatured?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}