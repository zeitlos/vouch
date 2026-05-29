import { query } from '@/lib/db';
import PostCard from '@/components/PostCard';
import NewPostForm from '@/components/NewPostForm';

interface Post {
  id: number;
  title: string;
  description: string | null;
  votes: number;
  status: string;
  created_at: string;
}

const boardTitle = process.env.BOARD_TITLE || 'Vouch is Nice!!';
const boardDescription =
  process.env.BOARD_DESCRIPTION || 'Share feedback, vote on features.';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let posts: Post[] = [];
  let dbError = false;

  try {
    posts = await query<Post>(
      'SELECT * FROM posts ORDER BY votes DESC, created_at DESC'
    );
  } catch {
    dbError = true;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {boardTitle}
        </h1>
        <p className="mt-2 text-gray-500">{boardDescription}</p>
      </header>

      <div className="mb-6">
        <NewPostForm />
      </div>

      {dbError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-medium text-amber-800">
            Database not connected
          </p>
          <p className="mt-1 text-sm text-amber-600">
            Set the <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">DATABASE_URL</code> environment variable to connect a PostgreSQL database.
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-700">
            No feedback yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Be the first to submit a feature request!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-gray-400">
        Powered by Vouch
      </footer>
    </main>
  );
}
