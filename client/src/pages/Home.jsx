import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Fingerprint, Globe2, Server, ShieldCheck, XCircle } from 'lucide-react';
import { validateEmail } from '../utils/emailValidation.js';

const CAN_DETECT = [
  'Confirmed appearances in known, publicly reported data breaches',
  'Email addresses referenced on publicly indexed web pages',
  'Basic domain-level mail security (SPF, DMARC, MX, HTTPS)',
  'General categories of data a breach reportedly exposed',
];

const CANNOT_DETECT = [
  'Every website that has ever stored this address',
  'Active logins, passwords, or authentication sessions',
  'Private messages, accounts, or account activity',
  'Anything behind a login wall or private database',
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();
  const validation = validateEmail(email);

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!validation.valid) return;
    navigate('/scan', { state: { email } });
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/60 px-4 py-1.5 text-xs font-mono text-mist-dim">
            <ShieldCheck className="h-3.5 w-3.5 text-signal" />
            Built on legitimate, public security sources only
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-mist sm:text-5xl">
            Find where your email has been exposed.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-mist-dim sm:text-lg">
            Check known data breaches, public exposure, and security-related signals
            associated with your email address.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-lg" noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="hero-email" className="sr-only">
                Email address
              </label>
              <input
                id="hero-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full rounded-md border border-ink-600 bg-ink-800 px-4 py-3 text-mist placeholder:text-mist-faint focus:border-signal"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-signal px-6 py-3 font-medium text-ink-950 transition-colors hover:bg-signal-soft"
              >
                Scan My Email <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 min-h-[1.25rem] text-left text-sm">
              {touched && email.length > 0 && (
                <span
                  className={
                    validation.tone === 'error'
                      ? 'text-danger'
                      : validation.tone === 'warn'
                      ? 'text-warn'
                      : 'text-ok'
                  }
                >
                  {validation.tone === 'error' ? '✕ ' : validation.tone === 'warn' ? '⚠ ' : '✓ '}
                  {validation.message}
                </span>
              )}
            </div>
            <p className="mt-3 text-xs text-mist-faint">
              We never store your email unless you choose to. Nothing is sold or shared.
            </p>
          </form>
        </div>
      </section>

      <section className="border-y border-ink-700/60 bg-ink-800/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 sm:grid-cols-3">
          <TrustIndicator
            icon={<Server className="h-5 w-5 text-signal" />}
            title="Legitimate sources only"
            body="Breach data comes from established providers such as Have I Been Pwned — never scraped private databases."
          />
          <TrustIndicator
            icon={<Fingerprint className="h-5 w-5 text-signal" />}
            title="Privacy by default"
            body="Your email isn't stored, sold, or logged in full unless you explicitly opt in."
          />
          <TrustIndicator
            icon={<Globe2 className="h-5 w-5 text-signal" />}
            title="Public data, respected limits"
            body="We honor robots.txt, API terms, and rate limits — no login attempts, ever."
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-display text-2xl font-semibold text-mist">What this scan can and can't tell you</h2>
        <p className="mt-2 max-w-2xl text-sm text-mist-dim">
          We'd rather under-promise than mislead you. Here's the honest scope of a TraceGuard scan.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-ink-700 bg-ink-800/60 p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ok">
              <ShieldCheck className="h-4 w-4" /> This scan can check
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-mist-dim">
              {CAN_DETECT.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-ok">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-ink-700 bg-ink-800/60 p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-danger">
              <XCircle className="h-4 w-4" /> This scan cannot check
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-mist-dim">
              {CANNOT_DETECT.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-danger">✕</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustIndicator({ icon, title, body }) {
  return (
    <div>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-ink-600 bg-ink-800">
        {icon}
      </div>
      <h3 className="font-display text-sm font-semibold text-mist">{title}</h3>
      <p className="mt-1 text-sm text-mist-dim">{body}</p>
    </div>
  );
}
