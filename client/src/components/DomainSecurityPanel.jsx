import StatusBadge from './StatusBadge.jsx';

const ROWS = [
  { key: 'mx', label: 'MX' },
  { key: 'spf', label: 'SPF' },
  { key: 'dkim', label: 'DKIM' },
  { key: 'dmarc', label: 'DMARC' },
  { key: 'https', label: 'HTTPS' },
];

function toneFor(status) {
  if (status === 'ok') return 'ok';
  if (status === 'warn') return 'warn';
  if (status === 'unknown') return 'unknown';
  return 'unknown';
}

export default function DomainSecurityPanel({ domainSecurity }) {
  if (!domainSecurity) return null;

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-800/60 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-mist-dim">
          Domain security
        </h3>
        <span className="font-mono text-sm text-mist">{domainSecurity.domain}</span>
      </div>

      <dl className="mt-5 divide-y divide-ink-700">
        {ROWS.map(({ key, label }) => {
          const entry = domainSecurity[key];
          if (!entry) return null;
          return (
            <div key={key} className="flex items-center justify-between py-3 font-mono text-sm">
              <dt className="text-mist-dim">{label}</dt>
              <dd>
                <StatusBadge tone={toneFor(entry.status)}>{entry.label}</StatusBadge>
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-4 text-xs text-mist-faint">
        Domain security reflects the mail domain's configuration, not the security of any one
        individual mailbox.
      </p>
    </div>
  );
}
