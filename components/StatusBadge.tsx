const statusConfig: Record<string, { label: string; className: string }> = {
  open: {
    label: 'Open',
    className: 'bg-gray-100 text-gray-700',
  },
  planned: {
    label: 'Planned',
    className: 'bg-blue-100 text-blue-700',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-700',
  },
  done: {
    label: 'Done',
    className: 'bg-emerald-100 text-emerald-700',
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.open;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
