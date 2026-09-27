import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { validateEmail } from '../utils/emailValidation.js';
import { runScan, ApiError } from '../services/api.js';

const STEPS = [
  { key: 'email', label: 'Validating email' },
  { key: 'breach', label: 'Checking breach databases' },
  { key: 'publicExposure', label: 'Checking public exposure' },
  { key: 'domain', label: 'Checking domain security' },
  { key: 'reputation', label: 'Analyzing findings' },
];

export default function ScanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [stage, setStage] = useState('input'); // input -> consent -> scanning -> error
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepTimerRef = useRef(null);

  const validation = validateEmail(email);

  useEffect(() => {
    return () => clearInterval(stepTimerRef.current);
  }, []);

  function handleContinueToConsent(e) {
    e.preventDefault();
    if (!validation.valid) return;
    setStage('consent');
  }

  async function handleConfirmScan() {
    setStage('scanning');
    setError(null);
    setActiveStep(0);

    stepTimerRef.current = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 650);

    try {
      const result = await runScan(email);
      clearInterval(stepTimerRef.current);
      setActiveStep(STEPS.length - 1);
      setTimeout(() => {
        navigate('/results', { state: { result, email } });
      }, 500);
    } catch (err) {
      clearInterval(stepTimerRef.current);
      const message =
        err instanceof ApiError
          ? err.message
          : 'Something went wrong while running the scan. Please try again.';
      setError(message);
      setStage('error');
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      {stage === 'input' && (
        <form onSubmit={handleContinueToConsent} noValidate>
          <h1 className="font-display text-2xl font-semibold text-mist">Scan your email</h1>
          <p className="mt-2 text-sm text-mist-dim">
            Enter the email address you'd like to check. It never appears in the page URL.
          </p>
          <label htmlFor="scan-email" className="sr-only">Email address</label>
          <input
            id="scan-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-6 w-full rounded-md border border-ink-600 bg-ink-800 px-4 py-3 text-mist placeholder:text-mist-faint focus:border-signal"
          />
          <div className="mt-2 min-h-[1.25rem] text-sm">
            {email.length > 0 && (
              <span
                className={
                  validation.tone === 'error' ? 'text-danger' : validation.tone === 'warn' ? 'text-warn' : 'text-ok'
                }
              >
                {validation.tone === 'error' ? '✕ ' : validation.tone === 'warn' ? '⚠ ' : '✓ '}
                {validation.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!validation.valid}
            className="mt-6 w-full rounded-md bg-signal px-6 py-3 font-medium text-ink-950 transition-colors hover:bg-signal-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </form>
      )}

      {stage === 'consent' && (
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist">Before we scan</h1>
          <div className="mt-6 rounded-lg border border-ink-700 bg-ink-800/60 p-6 text-sm leading-relaxed text-mist-dim">
            <p>
              By continuing, you authorize TraceGuard to check publicly available and authorized
              security data associated with <span className="font-mono text-mist">{email}</span>.
              TraceGuard does not access private accounts, passwords, private messages, or
              authentication sessions.
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStage('input')}
              className="flex-1 rounded-md border border-ink-600 px-6 py-3 font-medium text-mist-dim transition-colors hover:text-mist"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmScan}
              className="flex-1 rounded-md bg-signal px-6 py-3 font-medium text-ink-950 transition-colors hover:bg-signal-soft"
            >
              Continue Scan
            </button>
          </div>
        </div>
      )}

      {stage === 'scanning' && (
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist">Initializing secure scan...</h1>
          <ul className="mt-8 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step.key} className="flex items-center gap-3 text-sm">
                {i < activeStep ? (
                  <CheckCircle2 className="h-4 w-4 text-ok" />
                ) : i === activeStep ? (
                  <Loader2 className="h-4 w-4 animate-spin text-signal" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-ink-600" />
                )}
                <span className={i <= activeStep ? 'text-mist' : 'text-mist-faint'}>{step.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-xs text-mist-faint">Generating report...</p>
        </div>
      )}

      {stage === 'error' && (
        <div>
          <div className="flex items-center gap-2 text-danger">
            <ShieldAlert className="h-5 w-5" />
            <h1 className="font-display text-xl font-semibold">Scan couldn't complete</h1>
          </div>
          <p className="mt-3 text-sm text-mist-dim">{error}</p>
          <button
            onClick={() => setStage('consent')}
            className="mt-6 rounded-md bg-signal px-6 py-3 font-medium text-ink-950 transition-colors hover:bg-signal-soft"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
