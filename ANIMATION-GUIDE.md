# 🎨 Jizayn Animasyon Sistemi Rehberi

Bu döküman, projede kullanılan tüm scroll ve animasyon componentlerini açıklar.

## 📦 Mevcut Componentler

### 1. **SectionScroller** - Ana Scroll Yöneticisi
Mouse wheel ve touch gesture ile section'lar arası otomatik geçiş sağlar.

#### Kullanım:
```tsx
import SectionScroller from '@/components/SectionScroller';

<SectionScroller 
  sectionId="hero" 
  className="min-h-screen"
  threshold={0.5}
>
  {/* İçerik */}
</SectionScroller>
```

#### Özellikler:
- ✅ Mouse wheel ile section geçişi
- ✅ Touch/swipe gesture desteği (mobil)
- ✅ Otomatik parallax efektleri
- ✅ Smooth scroll animasyonları
- ✅ Opacity ve scale efektleri

#### Props:
- `sectionId`: Section'ın unique ID'si
- `className`: Ek CSS classları
- `threshold`: Görünürlük eşiği (0-1, varsayılan: 0.5)

---

### 2. **ScrollSection** - Scroll Animasyonları
Ekrana geldiğinde tetiklenen animasyonlar.

#### Kullanım:
```tsx
import ScrollSection from '@/components/ScrollSection';

<ScrollSection 
  animation="slide-up"
  delay={0.2}
  duration={0.6}
>
  {/* İçerik */}
</ScrollSection>
```

#### Animasyon Türleri:
- `fade` - Yumuşak görünme
- `slide-up` - Aşağıdan yukarı kayma
- `slide-down` - Yukarıdan aşağı kayma
- `slide-left` - Sağdan sola kayma
- `slide-right` - Soldan sağa kayma
- `scale` - Büyüme efekti
- `scale-rotate` - Büyüme + döndürme
- `rotate` - Hafif döndürme
- `zoom-in` - Yakınlaşma
- `zoom-out` - Uzaklaşma
- `flip-up` - 3D yukarı çevirme
- `flip-left` - 3D sola çevirme

#### Props:
- `animation`: Animasyon türü (yukarıdaki listeden)
- `delay`: Gecikme süresi (saniye)
- `duration`: Animasyon süresi (saniye)
- `parallax`: Parallax efekti aktif mi? (boolean)
- `parallaxSpeed`: Parallax hızı (piksel)

---

### 3. **StaggerContainer** - Sıralı Animasyonlar
Çocuk elementleri sırayla animasyonlu gösterir.

#### Kullanım:
```tsx
import StaggerContainer from '@/components/StaggerContainer';

<StaggerContainer 
  staggerDelay={0.15}
  duration={0.5}
  className="grid grid-cols-3 gap-4"
>
  <div>Öğe 1</div>
  <div>Öğe 2</div>
  <div>Öğe 3</div>
</StaggerContainer>
```

#### Özellikler:
- ✅ Çocuk elementleri sırayla animasyonlu gösterir
- ✅ Yumuşak fade + slide up efekti
- ✅ Özelleştirilebilir gecikme

#### Props:
- `staggerDelay`: Her öğe arası gecikme (saniye, varsayılan: 0.1)
- `duration`: Her öğenin animasyon süresi (saniye, varsayılan: 0.5)

---

### 4. **AnimatedCard** - 3D Hover Kartları
Mouse takibi ile 3D tilt efekti ve hover animasyonları.

#### Kullanım:
```tsx
import AnimatedCard from '@/components/AnimatedCard';

<AnimatedCard 
  tiltEffect={true}
  hoverScale={1.05}
  glowEffect={true}
  className="bg-white p-6 rounded-2xl"
>
  {/* Kart içeriği */}
</AnimatedCard>
```

#### Özellikler:
- ✅ Mouse pozisyonuna göre 3D tilt
- ✅ Hover'da büyüme efekti
- ✅ Glow (ışıltı) efekti
- ✅ Smooth spring animasyonlar

#### Props:
- `tiltEffect`: 3D tilt aktif mi? (boolean, varsayılan: true)
- `hoverScale`: Hover'da büyüme oranı (varsayılan: 1.05)
- `glowEffect`: Glow efekti aktif mi? (boolean, varsayılan: true)

---

### 5. **MouseScrollIndicator** - Scroll Göstergesi
Sayfanın üstünde görünen, kullanıcıya aşağı scroll yapabileceğini gösteren animasyonlu gösterge.

#### Kullanım:
```tsx
import MouseScrollIndicator from '@/components/MouseScrollIndicator';

<section>
  {/* İçerik */}
  <MouseScrollIndicator />
</section>
```

#### Özellikler:
- ✅ Otomatik fade out (scroll edilince)
- ✅ Animasyonlu mouse ikonu
- ✅ Responsive tasarım
- ✅ Sabit konum (fixed)

---

### 6. **SwipeSection** - Mobil Swipe Desteği
Mobil cihazlarda swipe gesture ile section geçişi.

#### Kullanım:
```tsx
import SwipeSection from '@/components/SwipeSection';

<SwipeSection
  onSwipeUp={() => scrollToNextSection()}
  onSwipeDown={() => scrollToPrevSection()}
  threshold={50}
>
  {/* İçerik */}
</SwipeSection>
```

#### Özellikler:
- ✅ Yukarı/aşağı swipe desteği
- ✅ Hız bazlı tetikleme
- ✅ Mesafe bazlı tetikleme
- ✅ Swipe göstergesi

#### Props:
- `onSwipeUp`: Yukarı swipe callback
- `onSwipeDown`: Aşağı swipe callback
- `threshold`: Minimum swipe mesafesi (piksel, varsayılan: 50)

---

### 7. **FadeIn** - Basit Fade Animasyonu
Intersection Observer ile basit fade in animasyonu.

#### Kullanım:
```tsx
import FadeIn from '@/components/FadeIn';

<FadeIn delay={200}>
  {/* İçerik */}
</FadeIn>
```

#### Özellikler:
- ✅ Basit fade + slide up
- ✅ Intersection Observer tabanlı
- ✅ Bir kere tetiklenir (once: true)

#### Props:
- `delay`: Gecikme (milisaniye)

---

## 🎯 Kullanım Örnekleri

### Örnek 1: Tam Sayfa Scroll Sistemi
```tsx
export default function HomePage() {
  return (
    <main className="scroll-smooth">
      {/* Hero */}
      <SectionScroller sectionId="hero" className="h-screen">
        <FadeIn>
          <h1>Hoş Geldiniz</h1>
          <MouseScrollIndicator />
        </FadeIn>
      </SectionScroller>

      {/* Özellikler */}
      <SectionScroller sectionId="features" className="min-h-screen">
        <ScrollSection animation="slide-up">
          <h2>Özelliklerimiz</h2>
        </ScrollSection>
        
        <StaggerContainer className="grid grid-cols-3 gap-4">
          <AnimatedCard>Özellik 1</AnimatedCard>
          <AnimatedCard>Özellik 2</AnimatedCard>
          <AnimatedCard>Özellik 3</AnimatedCard>
        </StaggerContainer>
      </SectionScroller>
    </main>
  );
}
```

### Örnek 2: Ürün Kartları Grid
```tsx
<StaggerContainer 
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
  staggerDelay={0.1}
>
  {products.map(product => (
    <AnimatedCard key={product.id} hoverScale={1.08}>
      <ProductCard product={product} />
    </AnimatedCard>
  ))}
</StaggerContainer>
```

### Örnek 3: Karmaşık Scroll Animasyonu
```tsx
<SectionScroller sectionId="about" className="min-h-screen">
  <ScrollSection animation="slide-right" delay={0}>
    <h2>Hakkımızda</h2>
  </ScrollSection>
  
  <ScrollSection animation="fade" delay={0.2}>
    <p>Açıklama metni...</p>
  </ScrollSection>
  
  <ScrollSection animation="scale-rotate" delay={0.4}>
    <Image src="/logo.png" alt="Logo" />
  </ScrollSection>
</SectionScroller>
```

---

## ⚙️ Global Ayarlar

### Framer Motion Konfigürasyonu
Tüm animasyonlar `framer-motion` kütüphanesi kullanılarak yapılmıştır.

### Varsayılan Easing Fonksiyonu
```js
ease: [0.25, 0.4, 0.25, 1] // Custom cubic-bezier
```

### Varsayılan Spring Ayarları
```js
{
  stiffness: 300,
  damping: 30,
  restDelta: 0.001
}
```

---

## 🎨 Best Practices

1. **SectionScroller** - Tüm ana section'lar için kullanın
2. **ScrollSection** - İçerik blokları için kullanın
3. **StaggerContainer** - Grid/liste öğeleri için kullanın
4. **AnimatedCard** - Hover efektli kartlar için kullanın
5. **MouseScrollIndicator** - Sadece hero section'da kullanın

### Performans İpuçları:
- ✅ Animasyon sayısını makul tutun
- ✅ `viewport: { once: true }` kullanarak gereksiz yeniden tetiklemeyi önleyin
- ✅ Ağır componentleri `React.memo()` ile sarın
- ✅ Mobilde daha hafif animasyonlar kullanın

---

## 📱 Responsive Davranış

Tüm componentler mobil ve desktop'ta düzgün çalışır:

- **Desktop**: Mouse wheel + hover efektleri
- **Tablet**: Touch gestures + hover efektleri
- **Mobile**: Swipe gestures + touch feedback

---

## 🐛 Sorun Giderme

### Animasyonlar çalışmıyor?
1. `framer-motion` yüklenmiş mi kontrol edin
2. Component'in `'use client'` ile işaretlendiğinden emin olun
3. Browser console'da hata var mı kontrol edin

### Scroll çok hassas?
`threshold` değerini ayarlayın (SectionScroller ve SwipeSection'da)

### Animasyonlar çok yavaş/hızlı?
`duration` ve `delay` değerlerini ayarlayın

---

## 📚 Daha Fazla Bilgi

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

**Geliştirici:** Jizayn Development Team  
**Son Güncelleme:** Ocak 2026
