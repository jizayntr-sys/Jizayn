import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'tr' ? 'Yönetici Girişi' : 'Admin Login';
  const description = locale === 'tr' 
    ? 'Jizayn yönetim paneline giriş yapın' 
    : 'Login to Jizayn admin panel';

  return {
    title,
    description,
    robots: {
      index: false, // Admin sayfası index'lenmemeli
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
