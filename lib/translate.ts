/**
 * Google Translate API ile metin çevirisi
 */

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

interface TranslateOptions {
  text: string;
  from: string;
  to: string;
}

export async function translateText({ text, from, to }: TranslateOptions): Promise<string> {
  // API key yoksa orijinal metni döndür
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('Google Translate API key bulunamadı. Çeviri yapılamıyor.');
    return text;
  }

  // Aynı dil ise çevirme
  if (from === to) {
    return text;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Çeviri hatası:', error);
    // Hata durumunda orijinal metni döndür
    return text;
  }
}

/**
 * Birden fazla metni toplu çevir (daha verimli)
 */
export async function translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
  if (!GOOGLE_TRANSLATE_API_KEY || from === to) {
    return texts;
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texts,
        source: from,
        target: to,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations.map((t: any) => t.translatedText);
  } catch (error) {
    console.error('Toplu çeviri hatası:', error);
    return texts;
  }
}

/**
 * Locale kodlarını Google Translate formatına çevir
 */
export function getLanguageCode(locale: string): string {
  const languageMap: Record<string, string> = {
    'tr': 'tr',
    'en': 'en',
    'fr': 'fr',
    'de': 'de',
    'ru': 'ru',
    'ar': 'ar',
    'es': 'es',
    'it': 'it',
    'pt': 'pt',
    'zh': 'zh-CN',
  };
  
  return languageMap[locale] || locale;
}
