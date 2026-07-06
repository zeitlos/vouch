import { NextRequest, NextResponse } from 'next/server';
import { isStorageConfigured, getImage } from '@/lib/storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (!isStorageConfigured()) {
    return new NextResponse('Not found', { status: 404 });
  }

  const { key } = await params;
  const objectKey = key.map((s) => decodeURIComponent(s)).join('/');

  const image = await getImage(objectKey);
  if (!image) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(Buffer.from(image.body), {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
