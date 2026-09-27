const TONES = {
  ok: { dot: 'bg-ok', text: 'text-ok' },
  warn: { dot: 'bg-warn', text: 'text-warn' },
  danger: { dot: 'bg-danger', text: 'text-danger' },
  unknown: { dot: 'bg-mist-faint', text: 'text-mist-dim' },
};

export default function StatusBadge({ tone = 'unknown', children }) {
  const t = TONES[tone] || TONES.unknown;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800 px-3 py-1 text-xs font-mono">
      <span className={`status-dot ${t.dot}`} aria-hidden="true" />
      <span className={t.text}>{children}</span>
    </span>
  );
}
