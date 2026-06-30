/**
 * Static Product Data
 * Database yerine statik ürün verileri
 */

import { Product } from '@/types/product';

const DEFAULT_PRODUCT_CREATED_AT = '2025-01-01T00:00:00.000Z';

function normalizeProductDates(product: Product): Product {
  const createdAt = product.createdAt || DEFAULT_PRODUCT_CREATED_AT;
  const updatedAt = product.updatedAt || createdAt;

  return {
    ...product,
    createdAt,
    updatedAt,
  };
}

// Statik ürün verileri
const rawProducts: Product[] = [
  {
    id: 'kumiko-lamp',
    category: 'lighting',
    tags: ['kumiko', 'wooden-lamp', 'japanese', 'handmade'],
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2026-02-18T09:00:00.000Z',
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg'
    },
    isFeatured: true,
    locales: {
      tr: {
        slug: 'kumiko-ahsap-masa-lambasi',
        name: 'El Yapımı Kumiko Ahşap Masa Lambası',
        description: '400 yıllık Japon Kumiko tekniği ile tamamen el yapımı ahşap masa lambası. Yapıştırıcısız geleneksel ahşap işçiliği, geometrik desenler ve LED aydınlatma ile eşsiz bir dekorasyon ürünü. Masif maun ve çam ağacından üretilen lamba, geometrik desenlerin arasından süzülen ışıkla büyüleyici gölge oyunları yaratır.',
        images: [
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-ana-urun-isikli.webp',
            alt: 'El Yapımı Kumiko Ahşap Masa Lambası - Ana Ürün Görünümü (Işıklı)',
            pinterestDescription: 'El yapımı Kumiko ahşap masa lambası - ışıklı ana ürün fotoğrafı'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-onden-gorunum-isikli.webp',
            alt: 'Kumiko Ahşap Masa Lambası - Önden Görünüm (Işıklı)',
            pinterestDescription: 'Kumiko masa lambası önden ışıklı görünüm'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-isiksiz-urun-fotografi.webp',
            alt: 'Kumiko Ahşap Masa Lambası - Işıksız Ürün Fotoğrafı',
            pinterestDescription: 'Kumiko ahşap masa lambası ışıksız stüdyo çekimi'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-yan-aci-gorunum.webp',
            alt: 'Kumiko Ahşap Masa Lambası - Yan Açı Görünüm',
            pinterestDescription: 'Kumiko masa lambası yan açı detay görünümü'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-ustten-uc-ceyrek-gorunum.webp',
            alt: 'Kumiko Ahşap Masa Lambası - Üstten Üç Çeyrek Görünüm',
            pinterestDescription: 'Kumiko masa lambası üstten üç çeyrek açı'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-lamba-ust-panel-detayi.webp',
            alt: 'Kumiko Ahşap Lamba - Üst Panel Detayı',
            pinterestDescription: 'Kumiko lamba üst panel ahşap işçiliği detayı'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-lamba-kumiko-desen-yakin-detay.webp',
            alt: 'Kumiko Desen Yakın Detay - Geometrik Ahşap İşçiliği',
            pinterestDescription: 'Kumiko geçme tekniği geometrik desen yakın plan'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-karanlik-salon-ortami.webp',
            alt: 'Kumiko Masa Lambası - Karanlık Salon Ortamında',
            pinterestDescription: 'Kumiko masa lambası karanlık salon atmosferi'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-karanlik-yatak-odasi-ortami.webp',
            alt: 'Kumiko Gece Lambası - Karanlık Yatak Odası Ortamı',
            pinterestDescription: 'Kumiko gece lambası yatak odasında huzurlu ışık'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-okuma-kosesi-ortami.webp',
            alt: 'Kumiko Masa Lambası - Okuma Köşesi Ortamında',
            pinterestDescription: 'Kumiko masa lambası okuma köşesi dekorasyonu'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-antre-konsol-ustunde.webp',
            alt: 'Kumiko Masa Lambası - Antre Konsol Üstünde',
            pinterestDescription: 'Kumiko masa lambası antre konsol dekorasyonu'
          }
        ],
        video: undefined,
        intro: 'El Yapımı Kumiko Ahşap Masa Lambası, 400 yıllık Japon Kumiko sanatı tekniği ile el emeği göz nuru üretilmiş özel bir ahşap masa lambasıdır. Geleneksel ahşap işçiliği ve modern tasarımın mükemmel birleşimi olan bu benzersiz ürün, yapıştırıcı kullanılmadan sadece hassas kesim ve geçme teknikleri ile üretilmektedir. Evinize doğal ahşabın sıcaklığını ve Uzakdoğu estetiğini taşır.',
        contentSections: [
          {
            title: 'Kumiko Sanatı Nedir ve Neden Özeldir?',
            body: 'Kumiko, 17. yüzyıldan beri Japonya\'da uygulanan geleneksel bir ahşap işçiliği sanatıdır. Bu teknik, ince ahşap çubukların yapıştırıcı kullanılmadan, sadece hassas kesimleri ve geçme tekniği ile birleştirilmesiyle karmaşık geometrik desenler oluşturulmasını sağlar. Her bir ahşap parça, milimetrik hassasiyetle kesilir ve yerleştirilir.',
          },
          {
            title: 'Neden Bu Masa Lambasını Tercih Etmelisiniz?',
            items: [
              'Geleneksel Sanat: 400 yıllık Japon Kumiko tekniği ile tamamen el yapımı',
              'Yapıştırıcısız Üretim: Tüm ahşap parçalar hassas kesim ve geçmelerle birleştirilir',
              'Işık Sanatı: LED ışık, geometrik desenlerin arasından süzülerek büyüleyici gölge oyunları yaratır',
              'Doğal Malzeme: %100 masif doğal ahşap - maun ve çam kombinasyonu',
            ],
          },
          {
            title: 'Kullanım Alanları ve Dekorasyon Fikirleri',
            items: [
              'Yatak Odası: Gece lambası olarak rahatlatıcı atmosfer',
              'Oturma Odası: Okuma lambası veya dekoratif aydınlatma',
              'Çalışma Masası: Modern ofis dekorasyonunda şık aksesuar',
              'Özel Hediye: Ev açılışı, yıldönümü için unutulmaz hediye',
            ],
          },
          {
            title: 'Işık ve Atmosfer',
            body: 'Kumiko lambanın en büyük özelliği, ışık ile ahşap geometrik desenlerin yarattığı büyüleyici atmosferdir. LED ışık kaynağı, ahşap çubukların arasından geçerek duvarlara ve tavana geometrik gölge desenleri yansıtır. Özellikle gece kullanımında, bu ışık oyunu mekanınıza huzurlu ve sıcak bir ambiyans katarken, aynı zamanda okuma yapmak için yeterli ışık sağlar.',
          },
          {
            title: 'Mükemmel Hediye Seçeneği',
            body: 'El yapımı Kumiko masa lambası, özel günleriniz ve hediye ihtiyaçlarınız için unutulmaz bir seçenektir:',
            items: [
              'Ev Açılışı: Yeni eve taşınan sevdiklerinize anlamlı hediye',
              'Evlilik Yıldönümü: Çiftler için romantik ve şık hediye',
              'Tasarım Meraklıları: Sanat ve tasarım seven arkadaşlarınıza',
            ],
          },
          {
            title: 'Jizayn Farkı',
            items: [
              'Usta Marangozlar: Deneyimli ustalar tarafından özenle üretilir',
              'Geleneksel Teknik: Orijinal Kumiko tekniği korunarak uygulanır',
              'Türk Malı: %100 yerli üretim',
              'El Emeği: Seri üretim değil, her biri özel olarak yapılır',
              'Müşteri Memnuniyeti: Memnuniyetiniz bizim önceliğimiz',
            ],
          },
          {
            title: 'Kullanım ve Bakım Önerileri',
            items: [
              'Temizlik: Sadece nemli bez kullanın. Sert fırçalar ahşap yüzeye zarar verebilir. Yılda bir kez doğal yağla besleyin.',
              'Bakım: Yumuşak ve kuru bir bez ile silin. Kimyasal temizleyiciler kullanmayın. Direkt güneş ışığından uzak tutun.',
              'Yerleştirme: Dengeli bir yüzeye yerleştirin. Isı kaynaklarından en az 1 metre uzakta tutun. Nem oranı %40-60 arası idealdir.',
            ],
          },
        ],
        packageContents: [
          { text: '1 adet El Yapımı Kumiko Ahşap Masa Lambası' },
          { text: 'E14 duy soket (lamba başlığı içinde)' },
          { text: '1.5 metre şık siyah kumaş elektrik kablosu' },
          { text: 'Kablo üzerinde açma/kapama anahtarı' },
          { text: 'CE sertifikalı elektrik aksam' },
          { text: 'Kullanım ve bakım kılavuzu' },
          { text: 'Özel tasarım ambalaj - hediye için hazır' },
          { text: 'LED ampul dahil değildir (ayrıca temin edilmelidir)', included: false },
        ],
        importantNotes: [
          { title: 'El Yapımı Ürün:', text: 'Her lamba benzersizdir, küçük farklılıklar olabilir' },
          { title: 'Doğal Ahşap:', text: 'Ahşabın doğal dokusu ve renk tonlarında varyasyonlar normal ve beklenir' },
          { title: 'Kusur Değildir:', text: 'Bu doğal farklılıklar ürünü daha da özel kılar' },
          { title: 'Ampul Dahil Değil:', text: 'E14 duy tipi LED ampul ayrıca temin edilmelidir' },
          { title: 'Ampul Önerisi:', text: '2-5W sıcak beyaz LED ampul kullanın (2700K-3000K)' },
          { title: 'Kırılgandır:', text: 'Ahşap yapı hassastır, darbelere karşı dikkatli olun' },
          { title: 'Nem:', text: 'Banyo, mutfak gibi yüksek nemli alanlarda kullanmayın' },
        ],
        dimensions: '20 x 20 x 25 cm',
        materials: 'Masif maun ve çam ağacı',
        specifications: [
          'Geleneksel Kumiko tekniği',
          'Yapıştırıcısız montaj',
          'E14 duy',
          'CE sertifikalı'
        ],
        sku: 'JIZAYN-KUMIKO-001',
        gtin: undefined,
        availability: 'InStock',
        priceRange: {
          min: 8000,
          max: 8000,
          currency: 'TRY'
        },
        // TODO: Gerçek Shopier ürün linki ile değiştirin
        shopierUrl: 'https://www.shopier.com/jizayn',
        amazonUrl: undefined,
        amazonOffer: undefined,
        etsyUrl: undefined,
        etsyOffer: undefined,
        metaTitle: 'El Yapımı Kumiko Ahşap Masa Lambası | Jizayn',
        metaDescription: '400 yıllık Japon Kumiko tekniği ile üretilen el yapımı ahşap masa lambası. Doğal malzeme, benzersiz tasarım, modern dekorasyon için ideal.',
        metaKeywords: ['kumiko', 'ahşap lamba', 'masa lambası', 'japon sanatı', 'el yapımı'],
        faq: [
          {
            question: 'Ampul dahil mi?',
            answer: 'Hayır, E14 duy tipi LED ampul ayrıca temin edilmelidir. 2-5W sıcak beyaz LED ampul öneriyoruz.'
          },
          {
            question: 'Nasıl temizlenir?',
            answer: 'Kuru veya hafif nemli yumuşak bez ile silin. Kimyasal temizleyici kullanmayın.'
          }
        ],
        reviews: []
      },
      en: {
        slug: 'kumiko-wooden-table-lamp',
        name: 'Handmade Kumiko Wooden Table Lamp',
        description: 'Completely handmade wooden table lamp with 400-year-old Japanese Kumiko technique. Traditional woodworking without glue, geometric patterns and LED lighting create a unique decoration piece. Made from solid mahogany and pine wood, the lamp creates mesmerizing shadow patterns with light filtering through geometric designs.',
        images: [
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-ana-urun-isikli.webp',
            alt: 'Handmade Kumiko Wooden Table Lamp - Main Product View (Lit)',
            pinterestDescription: 'Handmade Kumiko wooden table lamp - main lit product photo'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-onden-gorunum-isikli.webp',
            alt: 'Kumiko Wooden Table Lamp - Front View (Lit)',
            pinterestDescription: 'Kumiko table lamp front view with warm light'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-isiksiz-urun-fotografi.webp',
            alt: 'Kumiko Wooden Table Lamp - Unlit Product Photo',
            pinterestDescription: 'Kumiko wooden table lamp unlit studio shot'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-yan-aci-gorunum.webp',
            alt: 'Kumiko Wooden Table Lamp - Side Angle View',
            pinterestDescription: 'Kumiko table lamp side angle detail view'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-ustten-uc-ceyrek-gorunum.webp',
            alt: 'Kumiko Wooden Table Lamp - Top Three-Quarter View',
            pinterestDescription: 'Kumiko table lamp top three-quarter angle'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-lamba-ust-panel-detayi.webp',
            alt: 'Kumiko Wooden Lamp - Top Panel Detail',
            pinterestDescription: 'Kumiko lamp top panel woodworking detail'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-lamba-kumiko-desen-yakin-detay.webp',
            alt: 'Kumiko Pattern Close-Up - Geometric Woodwork',
            pinterestDescription: 'Kumiko joinery technique geometric pattern close-up'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-karanlik-salon-ortami.webp',
            alt: 'Kumiko Table Lamp - Dark Living Room Setting',
            pinterestDescription: 'Kumiko table lamp in a dark living room atmosphere'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-karanlik-yatak-odasi-ortami.webp',
            alt: 'Kumiko Night Lamp - Dark Bedroom Setting',
            pinterestDescription: 'Kumiko night lamp creating a peaceful bedroom glow'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-okuma-kosesi-ortami.webp',
            alt: 'Kumiko Table Lamp - Reading Corner Setting',
            pinterestDescription: 'Kumiko table lamp in a cozy reading corner'
          },
          {
            url: '/images/products/Kumiko/kumiko-ahsap-masa-lambasi-antre-konsol-ustunde.webp',
            alt: 'Kumiko Table Lamp - On Entry Console',
            pinterestDescription: 'Kumiko table lamp on an entryway console table'
          }
        ],
        video: undefined,
        intro: 'The Handmade Kumiko Wooden Table Lamp is a special wooden table lamp handcrafted with the 400-year-old Japanese Kumiko art technique. A perfect combination of traditional woodworking and modern design, this unique product is made without glue, using only precise cutting and joinery techniques. It brings the warmth of natural wood and Far Eastern aesthetics to your home.',
        contentSections: [
          {
            title: 'What is Kumiko Art and Why is it Special?',
            body: 'Kumiko is a traditional woodworking art practiced in Japan since the 17th century. This technique creates complex geometric patterns by joining thin wooden rods without glue, using only precise cuts and joinery. Each piece is cut and placed with millimeter precision.',
          },
          {
            title: 'Why Choose This Table Lamp?',
            items: [
              'Traditional Art: 400-year-old Japanese Kumiko technique, completely handmade',
              'No Glue Production: All wooden parts joined with precise cuts and joinery',
              'Light Art: LED light creates fascinating shadow play through geometric patterns',
              'Natural Material: 100% solid natural wood - mahogany and pine combination',
            ],
          },
          {
            title: 'Usage Areas and Decoration Ideas',
            items: [
              'Bedroom: As a night lamp for a relaxing atmosphere',
              'Living Room: Reading lamp or decorative lighting',
              'Desk: Elegant accessory in modern office decoration',
              'Special Gift: Unforgettable gift for housewarming, anniversary',
            ],
          },
          {
            title: 'Light and Atmosphere',
            body: 'The biggest feature of the Kumiko lamp is the fascinating atmosphere created by light and wooden geometric patterns. The LED light source passes through the wooden rods, reflecting geometric shadow patterns on walls and ceiling. Especially at night, this light play adds a peaceful and warm ambiance to your space while providing sufficient light for reading.',
          },
          {
            title: 'Perfect Gift Option',
            body: 'The handmade Kumiko table lamp is an unforgettable choice for your special occasions and gift needs:',
            items: [
              'Housewarming: Meaningful gift for loved ones moving to a new home',
              'Wedding Anniversary: Romantic and elegant gift for couples',
              'Design Enthusiasts: For friends who love art and design',
            ],
          },
          {
            title: 'The Jizayn Difference',
            items: [
              'Master Craftsmen: Carefully crafted by experienced masters',
              'Traditional Technique: Original Kumiko technique preserved and applied',
              'Turkish Made: 100% domestic production',
              'Handcrafted: Not mass production, each made individually',
              'Customer Satisfaction: Your satisfaction is our priority',
            ],
          },
          {
            title: 'Usage and Care Recommendations',
            items: [
              'Cleaning: Use only a damp cloth. Hard brushes can damage the wood surface. Nourish with natural oil once a year.',
              'Care: Wipe with a soft, dry cloth. Do not use chemical cleaners. Keep away from direct sunlight.',
              'Placement: Place on a balanced surface. Keep at least 1 meter away from heat sources. Humidity between 40-60% is ideal.',
            ],
          },
        ],
        packageContents: [
          { text: '1x Handmade Kumiko Wooden Table Lamp' },
          { text: 'E14 socket (inside the lamp head)' },
          { text: '1.5 meter elegant black fabric power cable' },
          { text: 'On/off switch on the cable' },
          { text: 'CE certified electrical components' },
          { text: 'Usage and care guide' },
          { text: 'Special design packaging - ready for gifting' },
          { text: 'LED bulb is not included (must be purchased separately)', included: false },
        ],
        importantNotes: [
          { title: 'Handmade Product:', text: 'Each lamp is unique, small differences may occur' },
          { title: 'Natural Wood:', text: 'Variations in natural texture and color tones of wood are normal and expected' },
          { title: 'Not a Defect:', text: 'These natural differences make the product even more special' },
          { title: 'Bulb Not Included:', text: 'E14 socket type LED bulb must be purchased separately' },
          { title: 'Bulb Recommendation:', text: 'Use 2-5W warm white LED bulb (2700K-3000K)' },
          { title: 'Fragile:', text: 'Wood structure is delicate, be careful against impacts' },
          { title: 'Moisture:', text: 'Do not use in high humidity areas like bathrooms and kitchens' },
        ],
        dimensions: '20 x 20 x 25 cm (7.9 x 7.9 x 9.8 inches)',
        materials: 'Solid mahogany and pine wood',
        specifications: [
          'Traditional Kumiko technique',
          'No glue assembly',
          'E14 socket',
          'CE certified'
        ],
        sku: 'JIZAYN-KUMIKO-001',
        gtin: undefined,
        availability: 'InStock',
        priceRange: {
          min: 175,
          max: 175,
          currency: 'USD'
        },
        // TODO: Gerçek Shopier ürün linki ile değiştirin
        shopierUrl: 'https://www.shopier.com/jizayn',
        amazonUrl: undefined,
        amazonOffer: undefined,
        etsyUrl: undefined,
        etsyOffer: undefined,
        metaTitle: 'Handmade Kumiko Wooden Table Lamp | Jizayn',
        metaDescription: 'Handmade wooden table lamp crafted with 400-year-old Japanese Kumiko technique. Natural materials, unique design, perfect for modern decor.',
        metaKeywords: ['kumiko', 'wooden lamp', 'table lamp', 'japanese art', 'handmade'],
        faq: [
          {
            question: 'Is the bulb included?',
            answer: 'No, E14 socket LED bulb must be purchased separately. We recommend 2-5W warm white LED bulb.'
          },
          {
            question: 'How to clean?',
            answer: 'Wipe with a dry or slightly damp soft cloth. Do not use chemical cleaners.'
          }
        ],
        reviews: []
      }
    }
  },
  {
    id: 'kumiko-akari-asanoha',
    category: 'lighting',
    tags: ['kumiko', 'akari', 'asanoha', 'table-lamp', 'sapele', 'japanese', 'handmade'],
    createdAt: '2026-06-22T10:00:00.000Z',
    updatedAt: '2026-06-22T10:00:00.000Z',
    brand: {
      name: 'Jizayn',
      url: 'https://www.jizayn.com',
      logo: 'https://www.jizayn.com/JizaynLogo.svg'
    },
    isFeatured: true,
    locales: {
      tr: {
        slug: 'kumiko-akari-asanoha-masa-lambasi',
        name: 'El Yapımı Kumiko Akari Asanoha Masa Lambası – Sapelli',
        description: 'Geleneksel Japon Kumiko tekniğiyle elde üretilen, fener formunda Akari masa lambası. Dış çerçevesi sıcak koyu tonlu sapelli ahşap, iç kafes panelleri 1. sınıf sarı çam ağacından işlenmiştir. Panellerdeki Asanoha (kenevir yaprağı) deseni arasından süzülen ışık, mekânınıza huzurlu bir fener atmosferi taşır.',
        images: [
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-gunes-isiginda-konsol-ustunde.webp',
            alt: 'Kumiko Akari Asanoha Masa Lambası - Güneş Işığında Konsol Üstünde',
            pinterestDescription: 'Kumiko Akari Asanoha masa lambası güneş ışığında konsol üzerinde'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-olculu-urun-gorseli.webp',
            alt: 'Kumiko Akari Asanoha Masa Lambası - Ölçülü Ürün Görseli',
            pinterestDescription: 'Kumiko Akari Asanoha masa lambası ölçülü ürün fotoğrafı'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-ayna-onunde-konsol-ustunde.webp',
            alt: 'Kumiko Akari Asanoha Masa Lambası - Ayna Önünde Konsol Üstünde',
            pinterestDescription: 'Kumiko Akari Asanoha lamba ayna önünde konsol dekorasyonu'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-salon-sehpa-ustunde.webp',
            alt: 'Kumiko Akari Asanoha Masa Lambası - Salon Sehpa Üstünde',
            pinterestDescription: 'Kumiko Akari Asanoha masa lambası salon sehpası üzerinde'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-dogal-isikli-oturma-odasi.webp',
            alt: 'Kumiko Akari Asanoha Masa Lambası - Doğal Işıklı Oturma Odası',
            pinterestDescription: 'Kumiko Akari Asanoha lamba doğal ışıklı oturma odasında'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-komodin-ustunde-gece.webp',
            alt: 'Kumiko Akari Asanoha Gece Lambası - Komodin Üstünde',
            pinterestDescription: 'Kumiko Akari gece lambası komodin üzerinde sıcak ışık'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-gece-yatak-odasi-1.webp',
            alt: 'Kumiko Akari Asanoha Masa Lambası - Gece Yatak Odası Ortamı',
            pinterestDescription: 'Kumiko Akari Asanoha lamba gece yatak odası atmosferi'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-sicak-yatak-odasi-2.webp',
            alt: 'Kumiko Akari Asanoha Masa Lambası - Sıcak Yatak Odası Ortamı',
            pinterestDescription: 'Kumiko Akari Asanoha lamba sıcak yatak odası dekorasyonu'
          }
        ],
        video: undefined,
        intro: 'Kumiko Akari Asanoha Masa Lambası, geleneksel Japon Kumiko tekniğiyle elde üretilen, fener formunda bir aydınlatma eseridir. Dış çerçevesi sıcak ve koyu tonlu sapelli ahşaptan, iç kafes panelleri ise 1. sınıf sarı çam ağacından işlenmiştir. Panellerdeki Asanoha (kenevir yaprağı) deseni, Japon kültüründe büyüme, sağlık ve korumayı simgeler. Yakıldığında asanoha geometrisi arasından süzülen sıcak ışık, mekânınıza huzurlu bir fener atmosferi taşır.',
        contentSections: [
          {
            title: 'Asanoha Deseni ve Anlamı',
            body: 'Asanoha (kenevir yaprağı), Japon sanatında yüzyıllardır kullanılan, altıgen tabanlı yıldız benzeri bir Kumiko motifidir. Hızlı ve dik büyüyen kenevir bitkisinden esinlenen bu desen; büyüme, sağlık ve koruma anlamı taşır. Her bir parça yapıştırıcı kullanılmadan, yalnızca hassas kesim ve geçme tekniğiyle birleştirilir.',
          },
          {
            title: 'Neden Bu Lambayı Tercih Etmelisiniz?',
            items: [
              'Asanoha Kumiko Deseni: Elde kesilip geçme tekniğiyle birleştirilen kenevir yaprağı motifi',
              'İki Ahşap Bir Arada: Dışı sapelli, içi 1. sınıf sarı çam ile sıcak ahşap kontrastı',
              'Fener Formu: Dört ayaklı, zarif Japon feneri silüeti',
              'Hazır Aydınlatma: Gövde içinde E14 duy ve elektrik aksamı kurulu',
            ],
          },
          {
            title: 'Kullanım Alanları ve Dekorasyon Fikirleri',
            items: [
              'Yatak Odası: Gece lambası olarak rahatlatıcı atmosfer',
              'Oturma Odası: Okuma lambası veya dekoratif aksan aydınlatma',
              'Çalışma Masası: Modern ve doğal ofis dekorasyonu',
              'Özel Hediye: Ev açılışı ve yıldönümleri için anlamlı seçenek',
            ],
          },
          {
            title: 'Işık ve Atmosfer',
            body: 'Sarı çam panellerin ardındaki ışık kaynağı, Asanoha geometrisinin arasından süzülerek mekâna sıcak, dingin bir fener ışığı yayar. Sapelli dış çerçeve gündüzleri koyu ve şık bir görünüm sunarken, gece yakıldığında desenin sıcak tonlarını öne çıkarır.',
          },
          {
            title: 'Mükemmel Hediye Seçeneği',
            body: 'El yapımı Akari Asanoha masa lambası, özel günleriniz için unutulmaz bir hediyedir:',
            items: [
              'Ev Açılışı: Yeni eve taşınan sevdiklerinize anlamlı hediye',
              'Evlilik Yıldönümü: Çiftler için sıcak ve zarif bir seçim',
              'Tasarım Meraklıları: Japon estetiğini ve el sanatını sevenler için',
            ],
          },
          {
            title: 'Jizayn Farkı',
            items: [
              'Usta Marangozlar: Deneyimli ustalar tarafından özenle üretilir',
              'Geleneksel Teknik: Orijinal Kumiko geçme tekniği korunur',
              'Seçili Malzeme: Sapelli ve 1. sınıf sarı çam',
              'El Emeği: Seri üretim değil, her biri özel olarak yapılır',
              'Türk Malı: %100 yerli üretim',
            ],
          },
          {
            title: 'Kullanım ve Bakım Önerileri',
            items: [
              'Temizlik: Yumuşak, kuru veya hafif nemli bez kullanın. Sert fırça ve kimyasallardan kaçının.',
              'Bakım: Direkt güneş ışığından ve ısı kaynaklarından uzak tutun.',
              'Yerleştirme: Dengeli bir yüzeye yerleştirin. Nem oranı %40-60 arası idealdir.',
            ],
          },
        ],
        packageContents: [
          { text: '1 adet El Yapımı Kumiko Akari Asanoha Masa Lambası' },
          { text: 'E14 duy ve elektrik aksamı (gövde içinde kurulu)' },
          { text: 'Şık kumaş kaplı elektrik kablosu' },
          { text: 'Kablo üzerinde açma/kapama anahtarı' },
          { text: 'Kullanım ve bakım kılavuzu' },
          { text: 'Özel tasarım ambalaj - hediyeye hazır' },
          { text: 'LED ampul dahil değildir (ayrıca temin edilmelidir)', included: false },
        ],
        importantNotes: [
          { title: 'El Yapımı Ürün:', text: 'Her lamba benzersizdir, küçük farklılıklar olabilir' },
          { title: 'Doğal Ahşap:', text: 'Sapelli ve çam ağacının doku ve renk tonlarında varyasyonlar normaldir' },
          { title: 'Kusur Değildir:', text: 'Bu doğal farklılıklar ürünü daha da özel kılar' },
          { title: 'Ampul Dahil Değil:', text: 'E14 duy tipi LED ampul ayrıca temin edilmelidir' },
          { title: 'Ampul Önerisi:', text: '2-5W sıcak beyaz LED ampul kullanın (2700K-3000K)' },
          { title: 'Kırılgandır:', text: 'İnce ahşap kafes hassastır, darbelere karşı dikkatli olun' },
          { title: 'Nem:', text: 'Banyo, mutfak gibi yüksek nemli alanlarda kullanmayın' },
        ],
        dimensions: '15 x 15 x 30 cm',
        materials: 'Dış çerçeve: sapelli ahşap • İç kafes panel: 1. sınıf sarı çam',
        specifications: [
          'Asanoha Kumiko deseni',
          'Yapıştırıcısız geçme tekniği',
          'Dışı sapelli / içi 1. sınıf sarı çam',
          'E14 duy (gövde içinde kurulu)',
          'Fener formu, dört ayaklı'
        ],
        sku: 'JIZAYN-AKARI-ASANOHA-01',
        gtin: undefined,
        availability: 'InStock',
        priceRange: {
          min: 8000,
          max: 8000,
          currency: 'TRY'
        },
        // TODO: Gerçek Shopier ürün linki ile değiştirin
        shopierUrl: 'https://www.shopier.com/jizayn',
        amazonUrl: undefined,
        amazonOffer: undefined,
        etsyUrl: undefined,
        etsyOffer: undefined,
        metaTitle: 'Kumiko Akari Asanoha Masa Lambası – Sapelli | Jizayn',
        metaDescription: 'El yapımı Kumiko Akari Asanoha masa lambası. Dışı sapelli, içi 1. sınıf sarı çam, geleneksel Japon geçme tekniği. Fener formunda sıcak ahşap aydınlatma.',
        metaKeywords: ['kumiko', 'akari', 'asanoha', 'masa lambası', 'sapelli', 'japon fener', 'el yapımı ahşap lamba'],
        faq: [
          {
            question: 'Ampul dahil mi?',
            answer: 'Hayır, E14 duy tipi LED ampul ayrıca temin edilmelidir. 2-5W sıcak beyaz LED ampul öneriyoruz. Duy ve elektrik aksamı gövde içinde kuruludur.'
          },
          {
            question: 'Hangi ahşaplar kullanılıyor?',
            answer: 'Dış çerçeve sapelli ahşaptan, iç kafes panelleri 1. sınıf sarı çam ağacından yapılmıştır.'
          },
          {
            question: 'Nasıl temizlenir?',
            answer: 'Kuru veya hafif nemli yumuşak bez ile silin. Kimyasal temizleyici kullanmayın.'
          }
        ],
        reviews: []
      },
      en: {
        slug: 'kumiko-akari-asanoha-table-lamp',
        name: 'Handmade Kumiko Akari Asanoha Table Lamp – Sapele',
        description: 'Lantern-shaped Akari table lamp handcrafted with the traditional Japanese Kumiko technique. The outer frame is made of warm dark-toned Sapele wood, while the inner lattice panels are crafted from first-class yellow pine. Light filtering through the Asanoha (hemp leaf) pattern brings a peaceful lantern atmosphere to your space.',
        images: [
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-gunes-isiginda-konsol-ustunde.webp',
            alt: 'Kumiko Akari Asanoha Table Lamp - On Console in Sunlight',
            pinterestDescription: 'Kumiko Akari Asanoha table lamp on console in sunlight'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-olculu-urun-gorseli.webp',
            alt: 'Kumiko Akari Asanoha Table Lamp - Product Image with Dimensions',
            pinterestDescription: 'Kumiko Akari Asanoha table lamp measured product photo'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-ayna-onunde-konsol-ustunde.webp',
            alt: 'Kumiko Akari Asanoha Table Lamp - On Console in Front of Mirror',
            pinterestDescription: 'Kumiko Akari Asanoha lamp on console in front of mirror'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-salon-sehpa-ustunde.webp',
            alt: 'Kumiko Akari Asanoha Table Lamp - On Living Room Coffee Table',
            pinterestDescription: 'Kumiko Akari Asanoha table lamp on living room coffee table'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-dogal-isikli-oturma-odasi.webp',
            alt: 'Kumiko Akari Asanoha Table Lamp - Natural Light Living Room',
            pinterestDescription: 'Kumiko Akari Asanoha lamp in a naturally lit living room'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-komodin-ustunde-gece.webp',
            alt: 'Kumiko Akari Asanoha Night Lamp - On Nightstand',
            pinterestDescription: 'Kumiko Akari night lamp on nightstand with warm glow'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-gece-yatak-odasi-1.webp',
            alt: 'Kumiko Akari Asanoha Table Lamp - Night Bedroom Setting',
            pinterestDescription: 'Kumiko Akari Asanoha lamp in a night bedroom atmosphere'
          },
          {
            url: '/images/products/KumikoAkari/kumiko-ahsap-masa-lambasi-sicak-yatak-odasi-2.webp',
            alt: 'Kumiko Akari Asanoha Table Lamp - Warm Bedroom Setting',
            pinterestDescription: 'Kumiko Akari Asanoha lamp in a warm bedroom decor'
          }
        ],
        video: undefined,
        intro: 'The Kumiko Akari Asanoha Table Lamp is a lantern-shaped lighting piece handcrafted with the traditional Japanese Kumiko technique. Its outer frame is made of warm dark-toned Sapele wood, while the inner lattice panels are crafted from first-class yellow pine. The Asanoha (hemp leaf) pattern symbolizes growth, health and protection in Japanese culture. When lit, the warm light filtering through the asanoha geometry brings a peaceful lantern atmosphere to your space.',
        contentSections: [
          {
            title: 'The Asanoha Pattern and Its Meaning',
            body: 'Asanoha (hemp leaf) is a star-like, hexagon-based Kumiko motif used in Japanese art for centuries. Inspired by the fast, straight-growing hemp plant, it symbolizes growth, health and protection. Each piece is joined without glue, using only precise cutting and joinery.',
          },
          {
            title: 'Why Choose This Lamp?',
            items: [
              'Asanoha Kumiko Pattern: Hand-cut hemp leaf motif joined with traditional joinery',
              'Two Woods Combined: Sapele exterior with first-class yellow pine interior for a warm contrast',
              'Lantern Form: Elegant four-legged Japanese lantern silhouette',
              'Ready to Light: E14 socket and wiring pre-installed inside the body',
            ],
          },
          {
            title: 'Usage Areas and Decoration Ideas',
            items: [
              'Bedroom: As a night lamp for a relaxing atmosphere',
              'Living Room: Reading lamp or decorative accent lighting',
              'Desk: Modern and natural office decoration',
              'Special Gift: Meaningful choice for housewarmings and anniversaries',
            ],
          },
          {
            title: 'Light and Atmosphere',
            body: 'The light source behind the yellow pine panels filters through the Asanoha geometry, casting a warm, serene lantern glow. The Sapele outer frame looks dark and elegant during the day, while at night it highlights the warm tones of the pattern.',
          },
          {
            title: 'Perfect Gift Option',
            body: 'The handmade Akari Asanoha table lamp is an unforgettable gift for your special occasions:',
            items: [
              'Housewarming: Meaningful gift for loved ones moving to a new home',
              'Wedding Anniversary: A warm and elegant choice for couples',
              'Design Enthusiasts: For those who love Japanese aesthetics and craftsmanship',
            ],
          },
          {
            title: 'The Jizayn Difference',
            items: [
              'Master Craftsmen: Carefully crafted by experienced masters',
              'Traditional Technique: Original Kumiko joinery preserved',
              'Selected Materials: Sapele and first-class yellow pine',
              'Handcrafted: Not mass production, each made individually',
              'Turkish Made: 100% domestic production',
            ],
          },
          {
            title: 'Usage and Care Recommendations',
            items: [
              'Cleaning: Use a soft, dry or slightly damp cloth. Avoid hard brushes and chemicals.',
              'Care: Keep away from direct sunlight and heat sources.',
              'Placement: Place on a balanced surface. Humidity between 40-60% is ideal.',
            ],
          },
        ],
        packageContents: [
          { text: '1x Handmade Kumiko Akari Asanoha Table Lamp' },
          { text: 'E14 socket and wiring (pre-installed inside the body)' },
          { text: 'Elegant fabric-covered power cable' },
          { text: 'On/off switch on the cable' },
          { text: 'Usage and care guide' },
          { text: 'Special design packaging - ready for gifting' },
          { text: 'LED bulb is not included (must be purchased separately)', included: false },
        ],
        importantNotes: [
          { title: 'Handmade Product:', text: 'Each lamp is unique, small differences may occur' },
          { title: 'Natural Wood:', text: 'Variations in the texture and color of Sapele and pine are normal' },
          { title: 'Not a Defect:', text: 'These natural differences make the product even more special' },
          { title: 'Bulb Not Included:', text: 'E14 socket type LED bulb must be purchased separately' },
          { title: 'Bulb Recommendation:', text: 'Use 2-5W warm white LED bulb (2700K-3000K)' },
          { title: 'Fragile:', text: 'The thin wooden lattice is delicate, be careful against impacts' },
          { title: 'Moisture:', text: 'Do not use in high humidity areas like bathrooms and kitchens' },
        ],
        dimensions: '15 x 15 x 30 cm (5.9 x 5.9 x 11.8 inches)',
        materials: 'Outer frame: Sapele wood • Inner lattice panels: first-class yellow pine',
        specifications: [
          'Asanoha Kumiko pattern',
          'No glue joinery',
          'Sapele exterior / yellow pine interior',
          'E14 socket (pre-installed)',
          'Lantern form, four legs'
        ],
        sku: 'JIZAYN-AKARI-ASANOHA-01',
        gtin: undefined,
        availability: 'InStock',
        priceRange: {
          min: 175,
          max: 175,
          currency: 'USD'
        },
        // TODO: Gerçek Shopier ürün linki ile değiştirin
        shopierUrl: 'https://www.shopier.com/jizayn',
        amazonUrl: undefined,
        amazonOffer: undefined,
        etsyUrl: undefined,
        etsyOffer: undefined,
        metaTitle: 'Kumiko Akari Asanoha Table Lamp – Sapele | Jizayn',
        metaDescription: 'Handmade Kumiko Akari Asanoha table lamp. Sapele exterior, first-class yellow pine interior, traditional Japanese joinery. Lantern-shaped warm wooden lighting.',
        metaKeywords: ['kumiko', 'akari', 'asanoha', 'table lamp', 'sapele', 'japanese lantern', 'handmade wooden lamp'],
        faq: [
          {
            question: 'Is the bulb included?',
            answer: 'No, an E14 socket LED bulb must be purchased separately. We recommend a 2-5W warm white LED bulb. The socket and wiring are pre-installed inside the body.'
          },
          {
            question: 'Which woods are used?',
            answer: 'The outer frame is made of Sapele wood and the inner lattice panels are made of first-class yellow pine.'
          },
          {
            question: 'How to clean?',
            answer: 'Wipe with a dry or slightly damp soft cloth. Do not use chemical cleaners.'
          }
        ],
        reviews: []
      }
    }
  }
];

export const products: Product[] = rawProducts.map(normalizeProductDates);

/**
 * Tüm ürünleri getirir
 * @param locale - Opsiyonel locale filtresi (kullanılmıyor artık)
 * @returns Product array
 */
export async function getAllProducts(locale?: string): Promise<Product[]> {
  return products;
}

/**
 * Slug ile ürün getirir
 * @param slug - Ürün slug'ı
 * @param locale - Locale kodu (tr, en, vs.)
 * @returns Product veya null
 */
export async function getProductBySlug(slug: string, locale: string): Promise<Product | null> {
  const product = products.find(p => {
    // Tüm locale'leri kontrol et
    const locales = p.locales as any;
    for (const loc in locales) {
      if (locales[loc]?.slug === slug) {
        return true;
      }
    }
    return false;
  });
  
  return product || null;
}

/**
 * ID ile ürün getirir
 * @param id - Ürün ID'si
 * @returns Product veya null
 */
export async function getProductById(id: string): Promise<Product | null> {
  const product = products.find(p => p.id === id);
  return product || null;
}
