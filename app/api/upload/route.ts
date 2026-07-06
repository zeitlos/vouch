import { NextRequest, NextResponse } from 'next/server';
import {
  isStorageConfigured,
  uploadImage,
  extensionForType,
  MAX_IMAGE_BYTES,
} from '@/lib/storage';

export async function POST(request: NextRequest) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: 'Image uploads are not configured' },
      { status: 501 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!extensionForType(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported image type. Use PNG, JPEG, GIF, or WebP.' },
      { status: 400 }
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: 'Image too large (max 5 MB)' },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = await uploadImage(buffer, file.type);

  return NextResponse.json({ key }, { status: 201 });
}
