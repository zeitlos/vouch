import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { postId } = await request.json();

  if (!postId) {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 }
    );
  }

  const [post] = await query(
    'UPDATE posts SET votes = votes + 1 WHERE id = $1 RETURNING *',
    [postId]
  );

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}
