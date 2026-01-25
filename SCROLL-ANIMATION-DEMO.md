# 🎬 Scroll Animasyon Demo

## Eklenen Özellikler

### ✅ 1. Mouse Wheel ile Section Geçişi
- Mouse wheel ile yukarı/aşağı scroll yapıldığında otomatik olarak bir sonraki/önceki section'a geçiş yapılır
- Smooth scroll animasyonu ile geçiş
- Threshold ayarlanabilir (varsayılan: 50px)

### ✅ 2. Mobil Swipe Gesture Desteği
- Mobil cihazlarda yukarı/aşağı swipe ile section geçişi
- Touch-friendly tasarım
- Hız ve mesafe bazlı tetikleme

### ✅ 3. Parallax Efektleri
- Section'lar scroll edilirken parallax efekti
- Opacity ve scale animasyonları
- Smooth spring animasyonlar

### ✅ 4. Scroll Göstergesi
- Hero section'da animasyonlu scroll indicator
- Otomatik fade out (scroll edilince)
- Mouse ikonu animasyonu

### ✅ 5. 3D Hover Kartları
- Mouse pozisyonuna göre 3D tilt efekti
- Glow (ışıltı) efekti
- Hover'da büyüme animasyonu

### ✅ 6. Gelişmiş Scroll Animasyonları
12 farklı animasyon türü:
- fade, slide-up, slide-down
- slide-left, slide-right
- scale, scale-rotate, rotate
- zoom-in, zoom-out
- flip-up, flip-left

## 🎯 Ana Sayfada Kullanım

### Hero Section
```tsx
<SectionScroller sectionId="hero" className="h-screen">
  <FadeIn>
    <h1>Hoş Geldiniz</h1>
    <MouseScrollIndicator />
  </FadeIn>
</SectionScroller>
```

**Özellikler:**
- ✅ Mouse wheel ile "featured" section'a geçiş
- ✅ Mobilde swipe ile geçiş
- ✅ Scroll indicator animasyonu
- ✅ Fade in animasyonu

### Featured Products Section
```tsx
<SectionScroller sectionId="featured" className="min-h-screen">
  <ScrollSection animation="slide-right">
    <h2>Öne Çıkan Ürünler</h2>
  </ScrollSection>
  
  <ScrollSection animation="scale" delay={0.2}>
    <FeaturedCarousel />
  </ScrollSection>
</SectionScroller>
```

**Özellikler:**
- ✅ Başlık sağdan sola kayarak gelir
- ✅ Carousel büyüyerek belirir
- ✅ Section geçişleri aktif

### Features Section
```tsx
<SectionScroller sectionId="features" className="min-h-screen">
  <ScrollSection animation="slide-up">
    <h2>Özelliklerimiz</h2>
  </ScrollSection>
  
  <StaggerContainer staggerDelay={0.15}>
    {features.map(feature => (
      <AnimatedCard key={feature.id}>
        <FeatureCard {...feature} />
      </AnimatedCard>
    ))}
  </StaggerContainer>
</SectionScroller>
```

**Özellikler:**
- ✅ Başlık aşağıdan yukarı kayar
- ✅ Kartlar sırayla belirir (stagger)
- ✅ Her kart 3D hover efektli
- ✅ Glow efekti

### Reviews Section
```tsx
<SectionScroller sectionId="reviews" className="min-h-screen">
  <ScrollSection animation="slide-left">
    <h2>Müşteri Yorumları</h2>
  </ScrollSection>
  
  <ScrollSection animation="fade" delay={0.2}>
    <CustomerReviewsCarousel />
  </ScrollSection>
</SectionScroller>
```

**Özellikler:**
- ✅ Başlık soldan sağa kayar
- ✅ Carousel fade in ile belirir
- ✅ Section geçişleri aktif

## 🎨 Animasyon Örnekleri

### Örnek 1: Basit Fade
```tsx
<ScrollSection animation="fade">
  <p>Bu metin fade in ile belirir</p>
</ScrollSection>
```

### Örnek 2: Slide Up + Delay
```tsx
<ScrollSection animation="slide-up" delay={0.3}>
  <h2>Bu başlık 0.3 saniye sonra aşağıdan gelir</h2>
</ScrollSection>
```

### Örnek 3: Scale Rotate
```tsx
<ScrollSection animation="scale-rotate" duration={0.8}>
  <Image src="/logo.png" alt="Logo" />
</ScrollSection>
```

### Örnek 4: Parallax
```tsx
<ScrollSection parallax={true} parallaxSpeed={100}>
  <div className="bg-image" />
</ScrollSection>
```

### Örnek 5: Stagger Grid
```tsx
<StaggerContainer 
  className="grid grid-cols-3 gap-4"
  staggerDelay={0.1}
>
  <div>Öğe 1</div>
  <div>Öğe 2</div>
  <div>Öğe 3</div>
</StaggerContainer>
```

### Örnek 6: 3D Card
```tsx
<AnimatedCard 
  tiltEffect={true}
  hoverScale={1.08}
  glowEffect={true}
>
  <ProductCard />
</AnimatedCard>
```

## 📱 Mobil Davranış

### Desktop (Mouse)
- Mouse wheel ile section geçişi
- Hover efektleri aktif
- 3D tilt efektleri

### Tablet
- Touch gestures
- Hover efektleri (bazı cihazlarda)
- Swipe ile section geçişi

### Mobile
- Swipe gestures
- Touch feedback
- Optimize edilmiş animasyonlar
- Daha hafif efektler

## ⚙️ Konfigürasyon

### Scroll Hassasiyeti
```tsx
<SectionScroller threshold={0.5}> {/* 0-1 arası */}
```

### Animasyon Hızı
```tsx
<ScrollSection duration={0.6}> {/* Saniye */}
```

### Stagger Gecikmesi
```tsx
<StaggerContainer staggerDelay={0.15}> {/* Saniye */}
```

### Hover Scale
```tsx
<AnimatedCard hoverScale={1.05}> {/* 1.0 = normal */}
```

## 🎯 Test Etmek İçin

1. Development server'ı başlatın:
```bash
npm run dev
```

2. Tarayıcıda açın: http://localhost:3001

3. Test senaryoları:
   - ✅ Mouse wheel ile scroll yapın
   - ✅ Mobilde swipe yapın
   - ✅ Kartların üzerine gelin (hover)
   - ✅ Farklı section'lara gidin
   - ✅ Responsive davranışı kontrol edin

## 🐛 Bilinen Sorunlar

Şu anda bilinen bir sorun yok! 🎉

## 📊 Performans

- ✅ Framer Motion optimize edilmiş
- ✅ GPU acceleration aktif
- ✅ Lazy loading destekli
- ✅ Intersection Observer kullanımı
- ✅ Minimal re-render

## 🚀 Gelecek İyileştirmeler

- [ ] Keyboard navigation (Arrow keys)
- [ ] Section progress indicator
- [ ] Custom cursor animasyonu
- [ ] Scroll velocity bazlı efektler
- [ ] Daha fazla animasyon türü

## 📚 Kaynaklar

- [Framer Motion](https://www.framer.com/motion/)
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)

---

**Geliştirme Tarihi:** Ocak 2026  
**Durum:** ✅ Tamamlandı ve Test Edildi
