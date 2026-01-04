/**
 * Çok dilli slug oluşturma utility
 */

// Dile özel karakter dönüşüm haritaları
const charMaps: Record<string, Record<string, string>> = {
  tr: {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'i',
    'İ': 'I', 'i': 'i',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  },
  de: {
    'ä': 'ae', 'Ä': 'Ae',
    'ö': 'oe', 'Ö': 'Oe',
    'ü': 'ue', 'Ü': 'Ue',
    'ß': 'ss'
  },
  fr: {
    'à': 'a', 'â': 'a', 'À': 'A', 'Â': 'A',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
    'î': 'i', 'ï': 'i', 'Î': 'I', 'Ï': 'I',
    'ô': 'o', 'Ô': 'O',
    'ù': 'u', 'û': 'u', 'ü': 'u',
    'Ù': 'U', 'Û': 'U', 'Ü': 'U',
    'ç': 'c', 'Ç': 'C',
    'œ': 'oe', 'Œ': 'Oe',
    'æ': 'ae', 'Æ': 'Ae'
  },
  es: {
    'á': 'a', 'Á': 'A',
    'é': 'e', 'É': 'E',
    'í': 'i', 'Í': 'I',
    'ó': 'o', 'Ó': 'O',
    'ú': 'u', 'Ú': 'U',
    'ñ': 'n', 'Ñ': 'N',
    'ü': 'u', 'Ü': 'U'
  },
  pt: {
    'á': 'a', 'â': 'a', 'ã': 'a', 'à': 'a',
    'Á': 'A', 'Â': 'A', 'Ã': 'A', 'À': 'A',
    'é': 'e', 'ê': 'e', 'É': 'E', 'Ê': 'E',
    'í': 'i', 'Í': 'I',
    'ó': 'o', 'ô': 'o', 'õ': 'o',
    'Ó': 'O', 'Ô': 'O', 'Õ': 'O',
    'ú': 'u', 'ü': 'u', 'Ú': 'U', 'Ü': 'U',
    'ç': 'c', 'Ç': 'C'
  },
  it: {
    'à': 'a', 'À': 'A',
    'è': 'e', 'é': 'e', 'È': 'E', 'É': 'E',
    'ì': 'i', 'Ì': 'I',
    'ò': 'o', 'ó': 'o', 'Ò': 'O', 'Ó': 'O',
    'ù': 'u', 'ú': 'u', 'Ù': 'U', 'Ú': 'U'
  },
  nl: {
    'ë': 'e', 'Ë': 'E',
    'ï': 'i', 'Ï': 'I',
    'ö': 'o', 'Ö': 'O',
    'ü': 'u', 'Ü': 'U'
  },
  ru: {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
    'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
    'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
    'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
    'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
    'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  },
  ar: {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'h', 'ئ': 'y', 'ء': 'a'
  }
};

/**
 * Metni slug'a dönüştürür (dile özel karakter dönüşümleri ile)
 * @param text - Dönüştürülecek metin
 * @param locale - Dil kodu (tr, en, de, fr, ru, ar, vs.)
 * @returns Slug formatında metin
 */
export function generateSlug(text: string, locale: string = 'en'): string {
  if (!text) return '';

  let slug = text.trim();

  // Dile özel karakter dönüşümleri
  const charMap = charMaps[locale] || {};
  for (const [char, replacement] of Object.entries(charMap)) {
    slug = slug.replace(new RegExp(char, 'g'), replacement);
  }

  // Tüm diller için genel temizlik
  slug = slug
    .toLowerCase()
    // Diğer özel karakterleri kaldır
    .normalize('NFD') // Unicode normalizasyonu
    .replace(/[\u0300-\u036f]/g, '') // Aksan işaretlerini kaldır
    // Alfanumerik olmayan karakterleri tire ile değiştir
    .replace(/[^a-z0-9]+/g, '-')
    // Başta ve sonda tire varsa kaldır
    .replace(/^-+|-+$/g, '')
    // Birden fazla ardışık tireyi tek tireye indir
    .replace(/-+/g, '-');

  return slug;
}

/**
 * Bir ürün adından tüm diller için slug'lar oluşturur
 * @param productNames - Dil bazında ürün isimleri { tr: 'İsim', en: 'Name', ... }
 * @returns Dil bazında slug'lar { tr: 'isim', en: 'name', ... }
 */
export function generateSlugsForAllLocales(
  productNames: Record<string, string>
): Record<string, string> {
  const slugs: Record<string, string> = {};
  
  for (const [locale, name] of Object.entries(productNames)) {
    if (name && name.trim()) {
      slugs[locale] = generateSlug(name, locale);
    }
  }
  
  return slugs;
}

/**
 * Slug'ın benzersiz olup olmadığını kontrol eder ve gerekirse sayı ekler
 * @param slug - Kontrol edilecek slug
 * @param existingSlugs - Mevcut slug'lar listesi
 * @returns Benzersiz slug
 */
export function makeSlugUnique(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let counter = 1;
  let uniqueSlug = `${slug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
  
  return uniqueSlug;
}
