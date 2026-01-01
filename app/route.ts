import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Daha güvenli email validation
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi gerekli.' }, { status: 400 });
    }

    // TODO: Burada e-posta adresini veritabanına kaydedin veya Mailchimp/Resend gibi bir servise gönderin.
    // Örnek: await db.newsletter.create({ data: { email } });
    
    console.log(`Yeni bülten abonesi: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}