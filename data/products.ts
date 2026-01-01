import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    category: 'decor',
    tags: ['ahşap', 'kutu', 'dekoratif', 'wood', 'box', 'handmade'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'el-yapimi-ahsap-dekoratif-kutu',
        name: 'El Yapımı Ahşap Dekoratif Kutu',
        description: 'Özel ceviz ağacından üretilmiş, el oyması detaylara sahip dekoratif saklama kutusu. Evinizin her köşesine şıklık katacak bu ürün, takılarınız veya değerli eşyalarınız için mükemmel bir saklama alanıdır.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'El Yapımı Ceviz Ağacı Dekoratif Takı Kutusu - Ön Görünüm',
            pinterestDescription: 'Jizayn El Yapımı Ahşap Kutu - Ceviz Ağacı',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'Ahşap Saklama Kutusu Açık Görünüm ve İç Hacim Detayı',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'El Yapımı Ahşap Dekoratif Kutu - Yan Görünüm',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'El Yapımı Ahşap Dekoratif Kutu - Detay',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'El Yapımı Ahşap Dekoratif Kutu - İç Hacim',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'El Yapımı Ahşap Dekoratif Kutu - Kullanım',
          },
        ],
        dimensions: '20cm x 15cm x 10cm',
        materials: 'Ceviz Ağacı, Doğal Yağ',
        specifications: ['El yapımı', 'Doğal malzeme', 'Koruyucu vernik', 'Yerli üretim'],
        sku: 'JZN-BOX-001-TR',
        availability: 'InStock',
        priceRange: {
          min: 450,
          max: 500,
          currency: 'TRY',
        },
        amazonUrl: 'https://www.amazon.com.tr/dp/EXAMPLE',
        amazonOffer: {
          url: 'https://www.amazon.com.tr/dp/EXAMPLE',
          availability: 'InStock',
          price: 450,
          priceCurrency: 'TRY',
          sku: 'AMZ-TR-001',
        },
        metaTitle: 'El Yapımı Ahşap Dekoratif Kutu | Jizayn',
        metaDescription: 'Ceviz ağacından el yapımı dekoratif kutu. Takı ve eşya saklamak için şık ahşap kutu modelleri Jizayn\'da.',
        metaKeywords: ['ahşap kutu', 'dekoratif kutu', 'takı kutusu', 'ceviz kutu', 'el yapımı hediye'],
        faq: [
          { question: 'Bu ürün hangi ağaçtan yapılmıştır?', answer: 'Bu ürün özel olarak seçilmiş ceviz ağacından el işçiliği ile üretilmiştir.' },
          { question: 'Kargo ne kadar sürer?', answer: 'Siparişleriniz genellikle 1-3 iş günü içerisinde kargoya verilir. Kargo süresi bulunduğunuz şehre göre değişiklik gösterebilir.' },
          { question: 'İade politikası nedir?', answer: 'Kullanılmamış ve hasar görmemiş ürünleri 14 gün içerisinde iade edebilirsiniz. Detaylı bilgi için iade politikamızı inceleyebilirsiniz.' }
        ],
        reviews: [
          {
            author: 'Ahmet Y.',
            datePublished: '2023-11-10',
            reviewBody: 'Ürün gerçekten çok kaliteli, ceviz ağacının dokusu harika.',
            reviewRating: 5,
            reviewSource: 'Website'
          },
          {
            author: 'Zeynep K.',
            datePublished: '2023-11-15',
            reviewBody: 'Kargo paketlemesi çok özenliydi. Teşekkürler.',
            reviewRating: 5,
            reviewSource: 'Website'
          },
          {
            author: 'Mehmet S.',
            datePublished: '2023-12-01',
            reviewBody: 'Boyutu beklediğimden biraz küçük ama işçilik mükemmel.',
            reviewRating: 4,
            reviewSource: 'Website'
          }
        ],
      },
      en: {
        slug: 'handmade-wooden-decorative-box',
        name: 'Handmade Wooden Decorative Box',
        description: 'Decorative storage box made of special walnut wood with hand-carved details. Adding elegance to every corner of your home, this product is a perfect storage space for your jewelry or valuables.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'Handmade Wooden Decorative Box - Front View',
            pinterestDescription: 'Jizayn Handmade Wooden Box - Walnut',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'Handmade Wooden Decorative Box - Open View',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'Handmade Wooden Decorative Box - Side View',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'Handmade Wooden Decorative Box - Detail',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'Handmade Wooden Decorative Box - Inside',
          },
          {
            url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
            alt: 'Handmade Wooden Decorative Box - Usage',
          },
        ],
        dimensions: '20cm x 15cm x 10cm',
        materials: 'Walnut Wood, Natural Oil',
        specifications: ['Handmade', 'Natural material', 'Protective varnish'],
        sku: 'JZN-BOX-001-EN',
        availability: 'InStock',
        priceRange: {
          min: 45,
          max: 50,
          currency: 'USD',
        },
        amazonUrl: 'https://www.amazon.com/dp/EXAMPLE',
        amazonOffer: {
          url: 'https://www.amazon.com/dp/EXAMPLE',
          availability: 'InStock',
          price: 45,
          priceCurrency: 'USD',
          sku: 'AMZ-US-001',
        },
        metaTitle: 'Handmade Wooden Decorative Box | Jizayn',
        metaDescription: 'Handmade decorative box made of walnut wood. Stylish wooden box models for storing jewelry and items at Jizayn.',
        metaKeywords: ['wooden box', 'decorative box', 'jewelry box', 'walnut box', 'handmade gift'],
        faq: [
          { question: 'What wood is this product made from?', answer: 'This product is handcrafted from specially selected walnut wood.' },
          { question: 'How long does shipping take?', answer: 'Your orders are usually shipped within 1-3 business days. Shipping time may vary depending on your city.' },
          { question: 'What is the return policy?', answer: 'You can return unused and undamaged products within 14 days. For detailed information, you can review our return policy.' }
        ],
      },
    },
  },
  {
    id: '2',
    category: 'decor',
    tags: ['ahşap', 'duvar sanatı', 'geometrik', 'wood', 'wall art', 'geometric'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'geometrik-ahsap-duvar-sanati',
        name: 'Geometrik Ahşap Duvar Sanatı',
        description: 'Modern ve minimalist tasarımıyla dikkat çeken, lazer kesim geometrik ahşap duvar sanatı. Oturma odanız veya ofisiniz için mükemmel bir dekorasyon parçası.',
        images: [ { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop', alt: 'Modern Lazer Kesim Geometrik Ahşap Duvar Tablosu' } ],
        dimensions: '50cm x 50cm',
        materials: 'Huş Kontrplak',
        specifications: ['Lazer kesim', 'Hafif yapı', 'Kolay montaj'],
        sku: 'JZN-WALL-002-TR',
        availability: 'InStock',
        priceRange: { min: 350, max: 400, currency: 'TRY' },
        metaTitle: 'Geometrik Ahşap Duvar Sanatı | Jizayn',
        metaDescription: 'Modern ve minimalist geometrik ahşap duvar sanatı modelleri. Ev ve ofis dekorasyonu için özel tasarımlar.',
        metaKeywords: ['ahşap duvar sanatı', 'geometrik dekor', 'lazer kesim tablo', 'modern duvar dekoru'],
      },
      en: {
        slug: 'geometric-wooden-wall-art',
        name: 'Geometric Wooden Wall Art',
        description: 'Laser-cut geometric wooden wall art with a modern and minimalist design. A perfect decoration piece for your living room or office.',
        images: [ { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop', alt: 'Geometric Wooden Wall Art' } ],
        dimensions: '50cm x 50cm',
        materials: 'Birch Plywood',
        specifications: ['Laser cut', 'Lightweight', 'Easy to install'],
        sku: 'JZN-WALL-002-EN',
        availability: 'InStock',
        priceRange: { min: 35, max: 40, currency: 'USD' },
        metaTitle: 'Geometric Wooden Wall Art | Jizayn',
        metaDescription: 'Modern and minimalist geometric wooden wall art models. Special designs for home and office decoration.',
        metaKeywords: ['wooden wall art', 'geometric decor', 'laser cut panel', 'modern wall decor'],
      }
    }
  },
  {
    id: '3',
    category: 'furniture',
    tags: ['sehpa', 'yan sehpa', 'masif ahşap', 'coffee table', 'side table', 'solid wood'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'masif-mese-yan-sehpa',
        name: 'Masif Meşe Yan Sehpa',
        description: 'Doğal kenarlı masif meşe ağacından üretilmiş, metal ayaklı modern yan sehpa. Her biri benzersiz dokuya sahip, el yapımı bir mobilya.',
        images: [ { url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop', alt: 'Masif Meşe Yan Sehpa' } ],
        dimensions: '45cm (çap) x 55cm (yükseklik)',
        materials: 'Masif Meşe, Metal',
        specifications: ['Doğal kenar', 'El yapımı', 'Sağlam metal ayaklar'],
        sku: 'JZN-TABLE-003-TR',
        availability: 'PreOrder',
        priceRange: { min: 1200, max: 1300, currency: 'TRY' },
        metaTitle: 'Masif Meşe Yan Sehpa | Jizayn',
        metaDescription: 'Doğal kenarlı masif meşe yan sehpa. Modern ve rustik tasarımlı el yapımı mobilyalar.',
        metaKeywords: ['yan sehpa', 'masif sehpa', 'meşe mobilya', 'doğal ahşap sehpa'],
      },
      en: {
        slug: 'solid-oak-side-table',
        name: 'Solid Oak Side Table',
        description: 'Modern side table made of solid oak wood with natural edges and metal legs. A handmade piece of furniture, each with a unique texture.',
        images: [ { url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop', alt: 'Solid Oak Side Table' } ],
        dimensions: '45cm (diameter) x 55cm (height)',
        materials: 'Solid Oak, Metal',
        specifications: ['Live edge', 'Handmade', 'Sturdy metal legs'],
        sku: 'JZN-TABLE-003-EN',
        availability: 'PreOrder',
        priceRange: { min: 120, max: 130, currency: 'USD' },
        metaTitle: 'Solid Oak Side Table | Jizayn',
        metaDescription: 'Live edge solid oak side table. Handmade furniture with a modern and rustic design.',
        metaKeywords: ['side table', 'solid wood table', 'oak furniture', 'live edge table'],
      }
    }
  },
  {
    id: '4',
    category: 'decor',
    tags: ['saat', 'duvar saati', 'ahşap', 'modern', 'clock', 'wall clock', 'wood'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'modern-ahsap-duvar-saati',
        name: 'Modern Ahşap Duvar Saati',
        description: 'Minimalist tasarımıyla evinizin veya ofisinizin havasını değiştirecek, sessiz mekanizmalı ahşap duvar saati.',
        images: [ { url: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=1000&auto=format&fit=crop', alt: 'Modern Ahşap Duvar Saati' } ],
        dimensions: '30cm çap',
        materials: 'Meşe Kaplama, Sessiz Mekanizma',
        specifications: ['Sessiz akar saniye', 'Kolay montaj', 'Pil dahil değildir'],
        sku: 'JZN-CLOCK-004-TR',
        availability: 'InStock',
        priceRange: { min: 650, max: 700, currency: 'TRY' },
        metaTitle: 'Modern Ahşap Duvar Saati | Jizayn',
        metaDescription: 'Sessiz mekanizmalı, minimalist ahşap duvar saati. Ev dekorasyonunuz için şık bir dokunuş.',
        metaKeywords: ['duvar saati', 'ahşap saat', 'modern saat', 'dekoratif saat'],
      },
      en: {
        slug: 'modern-wooden-wall-clock',
        name: 'Modern Wooden Wall Clock',
        description: 'Wooden wall clock with silent mechanism that will change the atmosphere of your home or office with its minimalist design.',
        images: [ { url: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=1000&auto=format&fit=crop', alt: 'Modern Wooden Wall Clock' } ],
        dimensions: '30cm diameter',
        materials: 'Oak Veneer, Silent Mechanism',
        specifications: ['Silent sweep second', 'Easy installation', 'Battery not included'],
        sku: 'JZN-CLOCK-004-EN',
        availability: 'InStock',
        priceRange: { min: 65, max: 70, currency: 'USD' },
        metaTitle: 'Modern Wooden Wall Clock | Jizayn',
        metaDescription: 'Minimalist wooden wall clock with silent mechanism. A stylish touch for your home decoration.',
        metaKeywords: ['wall clock', 'wooden clock', 'modern clock', 'decorative clock'],
      }
    }
  },
  {
    id: '5',
    category: 'decor',
    tags: ['ofis', 'düzenleyici', 'kalemlik', 'office', 'organizer', 'pen holder'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'ahsap-masaustu-duzenleyici',
        name: 'Ahşap Masaüstü Düzenleyici',
        description: 'Çalışma masanızı düzenli tutmanıza yardımcı olacak, telefon standı özellikli çok fonksiyonlu ahşap organizer.',
        images: [ { url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1000&auto=format&fit=crop', alt: 'Ahşap Masaüstü Düzenleyici' } ],
        dimensions: '25cm x 15cm x 5cm',
        materials: 'Kayın Ağacı',
        specifications: ['Telefon standı', 'Kalemlik bölmesi', 'Kartvizitlik'],
        sku: 'JZN-ORG-005-TR',
        availability: 'InStock',
        priceRange: { min: 400, max: 450, currency: 'TRY' },
        metaTitle: 'Ahşap Masaüstü Düzenleyici | Jizayn',
        metaDescription: 'Ofis masanız için şık ve fonksiyonel ahşap düzenleyici. Telefon standı ve kalemlik bir arada.',
        metaKeywords: ['masa düzenleyici', 'ofis organizer', 'ahşap kalemlik', 'masaüstü set'],
      },
      en: {
        slug: 'wooden-desktop-organizer',
        name: 'Wooden Desktop Organizer',
        description: 'Multifunctional wooden organizer with phone stand feature to help you keep your desk organized.',
        images: [ { url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1000&auto=format&fit=crop', alt: 'Wooden Desktop Organizer' } ],
        dimensions: '25cm x 15cm x 5cm',
        materials: 'Beech Wood',
        specifications: ['Phone stand', 'Pen holder compartment', 'Business card holder'],
        sku: 'JZN-ORG-005-EN',
        availability: 'InStock',
        priceRange: { min: 40, max: 45, currency: 'USD' },
        metaTitle: 'Wooden Desktop Organizer | Jizayn',
        metaDescription: 'Stylish and functional wooden organizer for your office desk. Phone stand and pen holder in one.',
        metaKeywords: ['desk organizer', 'office organizer', 'wooden pen holder', 'desktop set'],
      }
    }
  },
  {
    id: '6',
    category: 'decor',
    tags: ['bardak altlığı', 'mutfak', 'sunum', 'coaster', 'kitchen', 'serving'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'dogal-ahsap-bardak-altligi-seti',
        name: 'Doğal Ahşap Bardak Altlığı (4\'lü Set)',
        description: 'Doğal ağaç dokusunu koruyan, suya dayanıklı vernik ile işlenmiş 4 parçalı bardak altlığı seti.',
        images: [ { url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1000&auto=format&fit=crop', alt: 'Doğal Ahşap Bardak Altlığı Seti' } ],
        dimensions: '10cm çap',
        materials: 'Zeytin Ağacı',
        specifications: ['4 adet', 'Suya dayanıklı', 'Kaymaz taban'],
        sku: 'JZN-COAST-006-TR',
        availability: 'InStock',
        priceRange: { min: 250, max: 300, currency: 'TRY' },
        metaTitle: 'Doğal Ahşap Bardak Altlığı Seti | Jizayn',
        metaDescription: 'Zeytin ağacından üretilmiş doğal bardak altlığı seti. Sofralarınıza doğal bir dokunuş.',
        metaKeywords: ['bardak altlığı', 'ahşap sunum', 'zeytin ağacı', 'coaster set'],
      },
      en: {
        slug: 'natural-wood-coaster-set',
        name: 'Natural Wood Coaster Set (Set of 4)',
        description: '4-piece coaster set processed with water-resistant varnish, preserving the natural wood texture.',
        images: [ { url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1000&auto=format&fit=crop', alt: 'Natural Wood Coaster Set' } ],
        dimensions: '10cm diameter',
        materials: 'Olive Wood',
        specifications: ['4 pieces', 'Water resistant', 'Non-slip base'],
        sku: 'JZN-COAST-006-EN',
        availability: 'InStock',
        priceRange: { min: 25, max: 30, currency: 'USD' },
        metaTitle: 'Natural Wood Coaster Set | Jizayn',
        metaDescription: 'Natural coaster set made of olive wood. A natural touch to your tables.',
        metaKeywords: ['coaster set', 'wooden serving', 'olive wood', 'drink coaster'],
      }
    }
  },
  {
    id: '7',
    category: 'furniture',
    tags: ['laptop standı', 'ergonomik', 'ofis', 'laptop stand', 'ergonomic', 'office'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'ergonomik-ahsap-laptop-standi',
        name: 'Ergonomik Ahşap Laptop Standı',
        description: 'Duruş bozukluklarını önlemek için tasarlanmış, hava akışı sağlayan şık ahşap laptop yükseltici.',
        images: [ { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop', alt: 'Ergonomik Ahşap Laptop Standı' } ],
        dimensions: 'Uyumluluk: 13-16 inç laptoplar',
        materials: 'Huş Kontrplak',
        specifications: ['Ergonomik tasarım', 'Kolay taşınabilir', 'Isınmayı önler'],
        sku: 'JZN-STAND-007-TR',
        availability: 'InStock',
        priceRange: { min: 550, max: 600, currency: 'TRY' },
        metaTitle: 'Ergonomik Ahşap Laptop Standı | Jizayn',
        metaDescription: 'Sağlıklı çalışma ortamı için ahşap laptop standı. Şık tasarım ve ergonomik kullanım.',
        metaKeywords: ['laptop standı', 'ahşap stand', 'notebook yükseltici', 'ergonomik ofis'],
      },
      en: {
        slug: 'ergonomic-wooden-laptop-stand',
        name: 'Ergonomic Wooden Laptop Stand',
        description: 'Stylish wooden laptop riser designed to prevent posture disorders and provide airflow.',
        images: [ { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop', alt: 'Ergonomic Wooden Laptop Stand' } ],
        dimensions: 'Compatibility: 13-16 inch laptops',
        materials: 'Birch Plywood',
        specifications: ['Ergonomic design', 'Portable', 'Prevents overheating'],
        sku: 'JZN-STAND-007-EN',
        availability: 'InStock',
        priceRange: { min: 55, max: 60, currency: 'USD' },
        metaTitle: 'Ergonomic Wooden Laptop Stand | Jizayn',
        metaDescription: 'Wooden laptop stand for a healthy working environment. Stylish design and ergonomic use.',
        metaKeywords: ['laptop stand', 'wooden stand', 'notebook riser', 'ergonomic office'],
      }
    }
  },
  {
    id: '8',
    category: 'decor',
    tags: ['çiçeklik', 'saksı standı', 'bitki', 'plant stand', 'flower pot', 'plant'],
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg',
    },
    locales: {
      tr: {
        slug: 'dekoratif-ahsap-ciceklik',
        name: 'Dekoratif Ahşap Çiçeklik',
        description: 'Bitkilerinizi sergilemek için modern ve zarif bir yol. Üç ayaklı tasarımıyla dengeli ve şık.',
        images: [ { url: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?q=80&w=1000&auto=format&fit=crop', alt: 'Dekoratif Ahşap Çiçeklik' } ],
        dimensions: 'Yükseklik: 40cm, Çap: 25cm',
        materials: 'Kayın Ağacı',
        specifications: ['Kolay kurulum', 'Dayanıklı yapı', 'İç mekan kullanımı'],
        sku: 'JZN-PLANT-008-TR',
        availability: 'InStock',
        priceRange: { min: 380, max: 420, currency: 'TRY' },
        metaTitle: 'Dekoratif Ahşap Çiçeklik | Jizayn',
        metaDescription: 'Evinizdeki bitkiler için şık ahşap saksı standı. Modern dekorasyonun vazgeçilmezi.',
        metaKeywords: ['çiçeklik', 'saksı standı', 'ahşap ayaklı saksı', 'bitki standı'],
      },
      en: {
        slug: 'decorative-wooden-plant-stand',
        name: 'Decorative Wooden Plant Stand',
        description: 'A modern and elegant way to display your plants. Balanced and stylish with its three-legged design.',
        images: [ { url: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?q=80&w=1000&auto=format&fit=crop', alt: 'Decorative Wooden Plant Stand' } ],
        dimensions: 'Height: 40cm, Diameter: 25cm',
        materials: 'Beech Wood',
        specifications: ['Easy assembly', 'Durable structure', 'Indoor use'],
        sku: 'JZN-PLANT-008-EN',
        availability: 'InStock',
        priceRange: { min: 38, max: 42, currency: 'USD' },
        metaTitle: 'Decorative Wooden Plant Stand | Jizayn',
        metaDescription: 'Stylish wooden pot stand for your plants at home. Indispensable for modern decoration.',
        metaKeywords: ['plant stand', 'flower pot stand', 'wooden leg pot', 'plant holder'],
      }
    }
  }
];

export function getAllProducts(locale?: string) {
  if (!locale) return products;
  return products.filter(product => product.locales[locale]);
}

export function getProductBySlug(slug: string, locale: string) {
  return products.find(product => product.locales[locale]?.slug === slug);
}