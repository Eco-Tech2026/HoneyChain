const PRIORITY_LABEL = { high: 'High priority', medium: 'Medium priority', low: 'Good to know' };
const PRIORITY_TONE = { high: 'text-danger', medium: 'text-warn', low: 'text-mist-dim' };

export default function RecommendationList({ recommendations }) {
  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div key={rec.title} className="rounded-lg border border-ink-700 bg-ink-800/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-sm font-semibold text-mist">{rec.title}</h3>
            <span className={`text-xs font-mono ${PRIORITY_TONE[rec.priority] || 'text-mist-dim'}`}>
              {PRIORITY_LABEL[rec.priority] || ''}
            </span>
          </div>
          <p className="mt-2 text-sm text-mist-dim">{rec.detail}</p>
        </div>
      ))}
    </div>
  );
}
