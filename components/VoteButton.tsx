'use client';

import { useState } from 'react';

export default function VoteButton({
  postId,
  initialVotes,
}: {
  postId: number;
  initialVotes: number;
}) {
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    setLoading(true);
    setVotes((v) => v + 1); // optimistic

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        setVotes((v) => v - 1); // rollback
      }
    } catch {
      setVotes((v) => v - 1); // rollback
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-gray-200 px-3 py-2 transition-colors hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50"
    >
      <svg
        className="h-4 w-4 text-violet-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
      <span className="text-sm font-semibold text-gray-900">{votes}</span>
    </button>
  );
}
