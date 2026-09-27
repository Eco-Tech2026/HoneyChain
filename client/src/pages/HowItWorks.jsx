import { Link } from 'react-router-dom';

const STEPS = [
  {
    title: 'Enter your email',
    body: 'Your address is sent directly to our scan engine — it never appears in a URL, and isn't stored unless you opt in.',
  },
  {
    title: 'Give consent',
    body: 'We show exactly what we're about to check and why, before anything runs.',
  },
  {
    title: 'We check legitimate sources',
    body: 'A breach-data provider, public web indexes, and public DNS records for the domain — nothing behind a login wall.',
  },
  {
    title: 'You get a plain-language report',
    body: 'Confirmed breaches, public references, domain security signals, and an explainable exposure score.',
  },
];

const SCANNERS = [
  { name: 'BreachScanner', body: 'Checks confirmed appearances in known, publicly reported data breaches.' },
  { name: 'PasteExposureScanner', body: 'Checks licensed paste-archive providers for the address, where one is configured.' },
  { name: 'DomainScanner', body: 'Reads public DNS records for the domain \u2014 MX, SPF, DMARC, and HTTPS availability.' },
  { name: 'ReputationScanner', body: 'Categorizes services as confirmed, publicly associated, or unverifiable \u2014 never assumed.' },
  { name: 'PublicMentionScanner', body: 'Searches publicly indexed web pages via a licensed search API, where one is configured.' },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-mist">How TraceGuard works</h1>
      <p className="mt-3 max-w-2xl text-mist-dim">
        Every scan follows the same transparent path, from consent to report. No step happens
        silently.
      </p>

      <ol className="mt-12 space-y-8">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-ink-600 font-mono text-sm text-signal">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-mist">{step.title}</h2>
              <p className="mt-1 text-sm text-mist-dim">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 font-display text-xl font-semibold text-mist">Inside the scan engine</h2>
      <p className="mt-2 text-sm text-mist-dim">
        The scan runs as five independent modules, so a provider can be added or removed without
        touching the rest of the system.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {SCANNERS.map((s) => (
          <div key={s.name} className="rounded-lg border border-ink-700 bg-ink-800/60 p-5">
            <h3 className="font-mono text-sm text-signal">{s.name}</h3>
            <p className="mt-2 text-sm text-mist-dim">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-lg border border-ink-700 bg-ink-800/40 p-6 text-sm text-mist-dim">
        <p>
          TraceGuard never attempts logins, password guesses, or account enumeration of any kind.
          See our <Link to="/security" className="text-signal hover:underline">Security</Link> page
          for the full list of what we won't do.
        </p>
      </div>
    </div>
  );
}
