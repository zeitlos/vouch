import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const posts = await query(
    'SELECT * FROM posts ORDER BY votes DESC, created_at DESC'
  );
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const { title, description, image_key } = await request.json();

  if (!title || title.trim().length === 0) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    );
  }

  // Only accept keys this app generated, so a post can't reference arbitrary
  // objects in the bucket.
  const imageKey =
    typeof image_key === 'string' && image_key.startsWith('uploads/')
      ? image_key
      : null;

  const [post] = await query(
    'INSERT INTO posts (title, description, image_key) VALUES ($1, $2, $3) RETURNING *',
    [title.trim(), description?.trim() || null, imageKey]
  );

  return NextResponse.json(post, { status: 201 });
}
