/**
 * BASE_URL: Canonical URL'ler için kullanılır
 * 
 * Development'ta localhost kullanmak için:
 * .env.local dosyasına şunu ekleyin:
 * NEXT_PUBLIC_BASE_URL=http://localhost:3000
 * 
 * Production'da otomatik olarak production URL kullanılır
 */
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.jizayn.com';

