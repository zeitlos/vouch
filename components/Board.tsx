'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import StatusFilter from './StatusFilter';

interface Post {
  id: number;
  title: string;
  description: string | null;
  votes: number;
  status: string;
  created_at: string;
}

export default function Board({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  return (
    <>
      <div className="mb-4">
        <StatusFilter active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-700">
            {filter === 'all' ? 'No feedback yet' : `No ${filter} posts`}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {filter === 'all'
              ? 'Be the first to submit a feature request!'
              : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
