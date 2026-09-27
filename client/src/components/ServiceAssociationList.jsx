import StatusBadge from './StatusBadge.jsx';

export default function ServiceAssociationList({ services }) {
  const groups = [
    { title: 'Confirmed exposure', items: services.confirmed, tone: 'danger', symbol: '✓' },
    { title: 'Public association', items: services.publicAssociation, tone: 'warn', symbol: 'ℹ' },
    { title: 'Unable to verify', items: services.unableToVerify, tone: 'unknown', symbol: '?' },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {groups.map((group) => (
        <div key={group.title} className="rounded-lg border border-ink-700 bg-ink-800/60 p-5">
          <h3 className="font-display text-sm font-semibold text-mist">{group.title}</h3>
          {group.items.length === 0 ? (
            <p className="mt-3 text-xs text-mist-faint">None found.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {group.items.map((item) => (
                <li key={item.service} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-mist-dim">{item.service}</span>
                  <StatusBadge tone={group.tone}>{group.symbol}</StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
