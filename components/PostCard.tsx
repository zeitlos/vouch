import StatusBadge from './StatusBadge';
import VoteButton from './VoteButton';

interface Post {
  id: number;
  title: string;
  description: string | null;
  votes: number;
  status: string;
  created_at: string;
  image_key: string | null;
}

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <VoteButton postId={post.id} initialVotes={post.votes} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-gray-900">{post.title}</h3>
          <StatusBadge status={post.status} />
        </div>
        {post.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            {post.description}
          </p>
        )}
        {post.image_key && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/images/${post.image_key}`}
            alt={post.title}
            className="mt-3 max-h-72 w-full rounded-lg border border-gray-100 object-cover"
          />
        )}
        <p className="mt-2 text-xs text-gray-400">
          {timeAgo(post.created_at)}
        </p>
      </div>
    </div>
  );
}
