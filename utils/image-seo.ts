export const generatePinterestDescription = (
  productName: string,
  description: string,
  locale: string
) => {
  // HTML etiketlerini temizle ve boşlukları düzenle
  const cleanDesc = description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  // İlk 200 karakteri al
  return `${productName} | ${cleanDesc.slice(0, 200)}${cleanDesc.length > 200 ? '...' : ''}`;
};