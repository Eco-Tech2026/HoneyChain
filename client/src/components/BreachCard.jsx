import { AlertTriangle, Calendar } from 'lucide-react';

export default function BreachCard({ breach }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-800/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-mist">{breach.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-mono text-mist-faint">
            <Calendar className="h-3 w-3" /> Breach date: {formatDate(breach.breachDate)}
          </p>
        </div>
        <span className="rounded-full border border-danger/40 bg-danger/10 px-2.5 py-1 text-xs text-danger">
          Breach detected
        </span>
      </div>

      {breach.description && (
        <p className="mt-3 text-sm leading-relaxed text-mist-dim">{breach.description}</p>
      )}

      <div className="mt-4">
        <p className="text-xs font-mono uppercase tracking-wide text-mist-faint">Exposed data</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {breach.exposedDataCategories.map((cat) => (
            <li
              key={cat}
              className={`rounded-md border px-2.5 py-1 text-xs font-mono ${
                /password/i.test(cat)
                  ? 'border-warn/40 bg-warn/10 text-warn'
                  : 'border-ink-600 bg-ink-800 text-mist-dim'
              }`}
            >
              {/password/i.test(cat) ? <AlertTriangle className="mr-1 inline h-3 w-3" /> : '✓ '}
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.getFullYear();
}
