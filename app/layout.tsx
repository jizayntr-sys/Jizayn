import React from 'react';

export const metadata = {
  title: 'Jizayn Admin',
  description: 'Yönetim Paneli',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}