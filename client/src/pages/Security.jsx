import { CheckCircle2, XCircle } from 'lucide-react';

const WILL_NOT = [
  'Attempt to log in to any account',
  'Guess or brute-force passwords',
  'Perform credential stuffing',
  'Enumerate accounts through login forms',
  'Probe password-reset flows',
  'Intercept or request one-time passcodes (OTP)',
  'Extract session tokens or cookies',
  'Access private or restricted databases',
  'Bypass CAPTCHAs or authentication of any kind',
];

const DATA_PRINCIPLES = [
  'Confirmed evidence and inference are always kept separate. We say "unable to verify," never "no account exists."',
  'Password-related data is never displayed \u2014 only a category label such as "Password-related data was included."',
  'Email addresses are masked in every log line and never appear in a URL.',
  'Scan results are not stored permanently unless you explicitly opt in.',
  'We respect robots.txt, API terms of service, and rate limits on every external source.',
];

export default function Security() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-mist">Security &amp; safety boundaries</h1>
      <p className="mt-3 max-w-2xl text-mist-dim">
        TraceGuard is an exposure scanner, not an account-hacking tool. These boundaries are
        enforced in the architecture, not just described here.
      </p>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-danger">
          <XCircle className="h-5 w-5" /> TraceGuard will never
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {WILL_NOT.map((item) => (
            <li key={item} className="flex items-start gap-2 rounded-md border border-ink-700 bg-ink-800/60 p-4 text-sm text-mist-dim">
              <XCircle className="mt-0.5 h-4 w-4 flex-none text-danger" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ok">
          <CheckCircle2 className="h-5 w-5" /> How we handle your data
        </h2>
        <ul className="mt-5 space-y-3">
          {DATA_PRINCIPLES.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-mist-dim">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-ok" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-lg border border-ink-700 bg-ink-800/40 p-6">
        <h2 className="font-display text-base font-semibold text-mist">Application security</h2>
        <p className="mt-2 text-sm text-mist-dim">
          The backend applies Helmet security headers, strict CORS, request size limits, input
          sanitization, and per-IP rate limiting. API keys are read from environment variables and
          are never hard-coded or exposed to the client.
        </p>
      </section>
    </div>
  );
}
