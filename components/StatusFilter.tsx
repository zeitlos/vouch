'use client';

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'planned', label: 'Planned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export default function StatusFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (status: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            active === s.value
              ? 'bg-violet-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:text-violet-600'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
