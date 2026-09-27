function yearOf(dateStr) {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
}

export default function ExposureTimeline({ breaches, publicExposure, scannedAt }) {
  const events = [];

  breaches.forEach((b) => {
    const year = yearOf(b.breachDate);
    if (year) events.push({ year, label: `${b.name} breach`, tone: 'danger' });
  });

  publicExposure.forEach((p) => {
    const year = yearOf(p.dateSeen);
    if (year) events.push({ year, label: `Public exposure — ${p.source}`, tone: 'warn' });
  });

  const scanYear = yearOf(scannedAt) || new Date().getFullYear();
  events.push({ year: scanYear, label: 'Scan performed', tone: 'signal' });

  events.sort((a, b) => a.year - b.year);

  const toneDot = { danger: 'bg-danger', warn: 'bg-warn', signal: 'bg-signal' };

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-800/60 p-6">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-mist-dim">Timeline</h3>
      <ol className="mt-6 space-y-0">
        {events.map((event, i) => (
          <li key={`${event.year}-${event.label}`} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span className={`z-10 h-2.5 w-2.5 rounded-full ${toneDot[event.tone]}`} />
              {i < events.length - 1 && <span className="mt-1 w-px flex-1 bg-ink-600" />}
            </div>
            <div className="-mt-1 flex items-baseline gap-3">
              <span className="font-mono text-sm text-mist">{event.year}</span>
              <span className="text-sm text-mist-dim">{event.label}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
