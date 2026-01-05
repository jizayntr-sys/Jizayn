/**
 * Kumiko EN locale'i düzgün İngilizce içerik ile güncelle
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('Kumiko EN locale güncelleniyor...');

    // EN locale'i bul
    const enLocale = await prisma.productLocale.findFirst({
      where: {
        locale: 'en',
        Product: {
          locales: {
            some: {
              locale: 'tr',
              slug: 'el-yapimi-kumiko-ahsap-masa-lambasi'
            }
          }
        }
      }
    });

    if (!enLocale) {
      return NextResponse.json({ error: 'EN locale bulunamadı!' }, { status: 404 });
    }

    // Düzgün İngilizce içerik
    const properName = "Handmade Kumiko Wooden Desk Lamp - Traditional Japanese Wooden Lattice - LED Compatible Decorative Night Lamp";
    const properSlug = "handmade-kumiko-wooden-desk-lamp";
    const properDescription = `<p><strong>TRADITION MEETS MODERN!</strong></p>
<p>This unique desk lamp, crafted with the centuries-old Japanese Kumiko technique, is both a work of art and a functional lighting solution.</p>

<p><strong>🌟 WHY THIS LAMP?</strong></p>
<ul>
<li><strong>TRADITIONAL ART:</strong> Made with 400-year-old Japanese Kumiko technique</li>
<li><strong>NO GLUE:</strong> All wooden parts join through precise cuts and interlocking</li>
<li><strong>LIGHT ART:</strong> LED light filters through geometric patterns creating a mesmerizing atmosphere</li>
<li><strong>HANDMADE:</strong> Each lamp is carefully handcrafted and unique</li>
<li><strong>NATURAL MATERIAL:</strong> Made from solid mahogany and pine wood</li>
</ul>

<p><strong>💡 USAGE AREAS:</strong></p>
<ul>
<li>Bedroom night lamp</li>
<li>Living room ambient lighting</li>
<li>Study desk lamp</li>
<li>Meditation corner lighting</li>
<li>Spa and yoga studios</li>
<li>Restaurant and cafe decoration</li>
<li>Gift for special occasions</li>
</ul>

<p><strong>📋 PRODUCT SPECIFICATIONS:</strong></p>
<ul>
<li><strong>Material:</strong> Solid mahogany and pine wood</li>
<li><strong>Technique:</strong> Traditional Japanese Kumiko technique</li>
<li><strong>Size:</strong> Approximately 20x20x25 cm (W x D x H)</li>
<li><strong>Weight:</strong> 800-1000 grams</li>
<li><strong>Light:</strong> LED compatible (bulb not included)</li>
<li><strong>Assembly:</strong> Glue-free precision interlocking technique</li>
<li><strong>Finish:</strong> Non-toxic natural oil</li>
<li><strong>Color:</strong> Natural mahogany + Light pine contrast</li>
<li><strong>Production:</strong> Completely handmade in Turkey</li>
</ul>

<p><strong>💡 LIGHTING:</strong></p>
<ul>
<li>E14 socket type (small base)</li>
<li>Recommended: 2-5W LED bulb (warm white)</li>
<li>Power cord and switch included</li>
<li>Elegant black fabric cable</li>
<li>CE certified electrical components</li>
</ul>

<p><strong>🌿 NATURAL & ARTISTIC:</strong></p>
<ul>
<li>100% natural wood material</li>
<li>Glue-free production - traditional technique</li>
<li>Eco-friendly, sustainable</li>
<li>Each piece has unique wood grain patterns</li>
<li>Contains no allergens</li>
</ul>

<p><strong>❓ WHAT IS KUMIKO TECHNIQUE?</strong></p>
<p>Kumiko is a traditional Japanese woodworking art that has been practiced in Japan for 400 years. Intricate wooden pieces are precisely cut to create geometric patterns. They are joined without glue, using only interlocking techniques. Each piece is cut and placed with millimetric precision.</p>

<p><strong>🎁 PERFECT GIFT OPTION:</strong></p>
<ul>
<li>Housewarming gift</li>
<li>Wedding anniversary</li>
<li>For design enthusiasts</li>
<li>Japanese culture lovers</li>
<li>Architecture graduation</li>
<li>Teacher's gift</li>
<li>Birthday surprise</li>
</ul>

<p><strong>⚠️ IMPORTANT NOTES:</strong></p>
<ul>
<li>Each lamp is unique as it is handmade</li>
<li>Natural wood texture and color tones may vary</li>
<li>This makes the product even more special - not a quality defect</li>
<li>LED bulb not included (E14 base - warm white recommended)</li>
<li>Keep away from humid environments</li>
</ul>

<p><strong>🏆 WHY JIZAYN?</strong></p>
<ul>
<li>Crafted by master carpenters</li>
<li>Made preserving traditional techniques</li>
<li>100% Turkish made, local production</li>
<li>Handcrafted with care</li>
<li>Fast and secure shipping</li>
<li>Customer satisfaction guarantee</li>
<li>14-day return policy</li>
</ul>

<p><strong>✨ Add art and light to your home!</strong></p>

<p>#kumiko #woodenlamp #japanesestyle #handcrafted #desklamp #decorativelamp #traditionalart #woodworking #kumikoart #homedecor</p>`;
    const properMetaTitle = "Handmade Kumiko Wooden Lamp | Traditional Japanese Woodwork";
    const properMetaDescription = "Unique desk lamp crafted with traditional Japanese Kumiko technique. Handmade wooden lattice work creates stunning light patterns. LED compatible decorative lamp.";

    // Güncelle
    await prisma.productLocale.update({
      where: { id: enLocale.id },
      data: {
        name: properName,
        slug: properSlug,
        description: properDescription,
        metaTitle: properMetaTitle,
        metaDescription: properMetaDescription,
      }
    });

    console.log('✅ EN locale güncellendi!');

    return NextResponse.json({
      success: true,
      message: 'EN locale başarıyla güncellendi',
      newName: properName,
      newSlug: properSlug,
      urls: {
        tr: '/tr/urunler/el-yapimi-kumiko-ahsap-masa-lambasi',
        en: `/en/products/${properSlug}`
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({ 
      error: 'Güncelleme sırasında hata',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
