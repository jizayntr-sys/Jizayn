# MVP Editor

Bu proje içine yeniden kullanılabilir bir MVP görsel editor eklendi.

## Route

- `/tr/editor`
- `/en/editor`

## Ana Sayfaya Etkisi

Editor verisi localStorage'da varsa ana sayfa (`/tr` ve `/en`) bu veriyi gösterir.
Editor verisi yoksa mevcut kodlu ana sayfa görünür.

## Özellikler

- Blok ekleme: `div`, `heading`, `paragraph`, `button`, `image`, `spacer`
- Blok sıralama: yukarı / aşağı
- Blok işlemleri: kopyala / sil
- Stil düzenleme:
  - font rengi
  - arka plan rengi
  - font size / weight
  - padding / margin
  - border width / color / radius
  - text align
  - max width
  - spacer yüksekliği
- JSON export / import
- localStorage otomatik kayıt

## Dosya Yapısı

- `app/[locale]/editor/page.tsx`
- `components/editor/MvpEditor.tsx`
- `components/editor/EditorRenderer.tsx`
- `lib/editor/types.ts`
- `lib/editor/default-page.ts`
- `lib/editor/storage.ts`

## Diğer Projelere Taşıma

Aşağıdaki klasörleri kopyalaman yeterli:

- `components/editor`
- `lib/editor`
- route dosyası: `app/[locale]/editor/page.tsx` (veya kendi route yapına göre eşdeğeri)

Gerekirse yalnızca import path'lerini proje alias yapına göre (`@/`) güncelle.

## Not

Bu sürüm MVP olduğu için veri kalıcılığı `localStorage` üstündedir. Kalıcı ve ekip kullanımına uygun sürüm için bir API + veritabanı (örn. Supabase) katmanı eklenmelidir.
