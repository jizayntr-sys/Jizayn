import { translateText } from './lib/translate';

async function testTranslate() {
  const text = "Merhaba dünya! Bu bir test metnidir.";
  
  console.log('Türkçe metin:', text);
  console.log('İngilizceye çevriliyor...\n');
  
  const result = await translateText({
    text,
    from: 'tr',
    to: 'en'
  });
  
  console.log('Çeviri sonucu:', result);
}

testTranslate();
