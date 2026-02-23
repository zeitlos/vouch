'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700"
      >
        Submit Feedback
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <input
        type="text"
        placeholder="Feature title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        autoFocus
      />
      <textarea
        placeholder="Describe the feature... (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTitle('');
            setDescription('');
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
