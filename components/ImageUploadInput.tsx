'use client';

import { useState } from 'react';

interface ImageUploadInputProps {
  num: number;
}

export default function ImageUploadInput({ num }: ImageUploadInputProps) {
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Görsel {num} {num === 1 && <span className="text-red-500">(Zorunlu)</span>}
      </label>
      
      {/* URL veya Dosya */}
      <div className="space-y-2">
        <label className="block text-xs text-gray-600">Görsel URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            name={`imageUrl_${num}`}
            value={previewUrl || fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              setPreviewUrl('');
            }}
            placeholder={`Örn: /images/products/urun-${num}.webp`}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
            required={num === 1}
          />
          <label className="px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-blue-600">Seç</span>
            <input
              type="file"
              name={`newImageFile_${num}`}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">
          💡 URL girebilir veya dosya seçebilirsiniz
        </p>
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">Alt Text (SEO)</label>
        <input
          type="text"
          name={`imageAlt_${num}`}
          placeholder={num === 1 ? "Ürün adı otomatik kullanılır" : `Görsel ${num} açıklaması`}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mt-3">
          <label className="block text-xs text-gray-600 mb-1">Önizleme</label>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
