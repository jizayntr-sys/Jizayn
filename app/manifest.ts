import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jizayn - Ahşap Dekoratif Ürünler',
    short_name: 'Jizayn',
    description: 'El yapımı ahşap dekoratif ürünler. Özel tasarım mobilya ve dekorasyon ürünleri.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb', // bg-gray-50
    theme_color: '#4338ca', // indigo-700
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}