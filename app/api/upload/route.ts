import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (files.length > 6) {
      return NextResponse.json({ error: 'Maximum 6 files allowed' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    
    // Upload klasörü yoksa oluştur
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
      }

      // Benzersiz dosya adı oluştur (WebP formatında)
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomString}.webp`;
      
      const filePath = join(uploadDir, fileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Görseli WebP formatına dönüştür ve kaydet
      await sharp(buffer)
        .webp({ quality: 85 }) // %85 kalite (iyi kalite/dosya boyutu dengesi)
        .toFile(filePath);
      
      // Public URL oluştur
      const publicUrl = `/uploads/products/${fileName}`;
      uploadedFiles.push(publicUrl);
    }

    return NextResponse.json({ urls: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}

