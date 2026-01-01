import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, productName } = body;

    // Daha güvenli email validation
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi gerekli.' }, { status: 400 });
    }

    // TODO: Stok bildirim talebini veritabanına kaydedin
    console.log(`Stok bildirimi talebi: ${email} - ${productName}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stok bildirim hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}