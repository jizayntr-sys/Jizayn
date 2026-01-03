'use client';

import { useState } from 'react';

interface ImageUploadInputProps {
  num: number;
}

export default function ImageUploadInput({ num }: ImageUploadInputProps) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(`Yükleniyor: ${file.name}`);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Yeni Görsel {num}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          name={`newImage_${num}`}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Görsel URL (örn: /images/products/...)"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
        />
        <label className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Yükle</span>
          <input
            type="file"
            name={`newImageFile_${num}`}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <input
        type="text"
        name={`newImage_${num}_alt`}
        placeholder="Alt Text (SEO için)"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
      />
      <input
        type="number"
        name={`newImage_${num}_order`}
        placeholder="Sıra (0 = önizleme)"
        min="0"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
      />
    </div>
  );
}
