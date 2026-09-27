import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ChevronDown, FlaskConical } from 'lucide-react';
import ScoreDial from '../components/ScoreDial.jsx';
import BreachCard from '../components/BreachCard.jsx';
import ServiceAssociationList from '../components/ServiceAssociationList.jsx';
import DomainSecurityPanel from '../components/DomainSecurityPanel.jsx';
import ExposureTimeline from '../components/ExposureTimeline.jsx';
import RecommendationList from '../components/RecommendationList.jsx';

export default function ResultsPage() {
  const location = useLocation();
  const result = location.state?.result;
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!result) {
    return <Navigate to="/scan" replace />;
  }

  const {
    emailMasked,
    isDisposableEmail,
    demoMode,
    status,
    stageStatus,
    breaches,
    publicExposure,
    services,
    domainSecurity,
    riskScore,
    recommendations,
    scannedAt,
  } = result;

  const domainWarnings = ['mx', 'spf', 'dmarc', 'https'].filter(
    (k) => domainSecurity?.[k]?.status === 'warn'
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {demoMode && (
        <div className="mb-8 flex items-center gap-2 rounded-md border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-signal-soft">
          <FlaskConical className="h-4 w-4" />
          <span>
            <strong className="font-semibold">Demo mode.</strong> Using simulated sample data — no
            real email was scanned.
          </span>
        </div>
      )}

      {status === 'partial' && <PartialStatusBanner stageStatus={stageStatus} />}

      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-mono text-mist-faint">Report for</p>
          <h1 className="font-display text-2xl font-semibold text-mist">{emailMasked}</h1>
          {isDisposableEmail && (
            <p className="mt-1 text-xs text-warn">⚠ Disposable email provider detected</p>
          )}
        </div>
        <Link
          to="/scan"
          className="rounded-md border border-ink-600 px-4 py-2 text-sm text-mist-dim transition-colors hover:text-mist"
        >
          Scan another email
        </Link>
      </div>

      {/* Overview */}
      <section className="mt-10 grid gap-8 rounded-xl border border-ink-700 bg-ink-800/50 p-8 sm:grid-cols-[auto,1fr]">
        <div className="flex flex-col items-center gap-3">
          <ScoreDial score={riskScore.score} />
          <button
            onClick={() => setShowBreakdown((v) => !v)}
            className="flex items-center gap-1 text-xs text-mist-dim hover:text-mist"
          >
            Why is my score {riskScore.score}? <ChevronDown className={`h-3 w-3 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-mist-faint">
            Security exposure score
          </p>
          <p className="mt-1 text-sm text-mist-dim">{riskScore.label}</p>

          {showBreakdown && (
            <ul className="mt-4 space-y-1.5 font-mono text-sm">
              {riskScore.breakdown.length === 0 && (
                <li className="text-mist-faint">No contributing factors found.</li>
              )}
              {riskScore.breakdown.map((item) => (
                <li key={item.label} className="flex gap-2 text-mist-dim">
                  <span className="text-signal">+{item.points}</span> {item.label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-ink-700 pt-6 text-center">
            <StatBlock value={breaches.length} label={breaches.length === 1 ? 'Breach' : 'Breaches'} />
            <StatBlock
              value={publicExposure.length}
              label={publicExposure.length === 1 ? 'Public reference' : 'Public references'}
            />
            <StatBlock value={domainWarnings} label={domainWarnings === 1 ? 'Domain warning' : 'Domain warnings'} />
          </div>
        </div>
      </section>

      {/* Breaches */}
      <SectionHeading title="Breaches" />
      {breaches.length === 0 ? (
        <EmptyState text="No matching breach was found in the sources checked." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {breaches.map((b) => (
            <BreachCard key={b.name} breach={b} />
          ))}
        </div>
      )}

      {/* Services */}
      <SectionHeading title="Services associated with this email" />
      <ServiceAssociationList services={services} />

      {/* Exposed information summary */}
      <SectionHeading title="Exposed information categories" />
      <ExposedCategories breaches={breaches} />

      {/* Domain security + timeline */}
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <DomainSecurityPanel domainSecurity={domainSecurity} />
        <ExposureTimeline breaches={breaches} publicExposure={publicExposure} scannedAt={scannedAt} />
      </div>

      {/* Recommendations */}
      <SectionHeading title="Recommended security actions" />
      <RecommendationList recommendations={recommendations} />

      <p className="mt-14 text-xs leading-relaxed text-mist-faint">
        Results reflect the legitimate, public sources TraceGuard could check at the time of this
        scan. They cannot guarantee discovery of every place this email has ever been used, and
        should be treated as an informational starting point rather than a complete or
        authoritative security assessment.
      </p>
    </div>
  );
}

function SectionHeading({ title }) {
  return <h2 className="mb-5 mt-14 font-display text-lg font-semibold text-mist">{title}</h2>;
}

function StatBlock({ value, label }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold text-mist">{value}</p>
      <p className="text-xs text-mist-faint">{label}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-ink-600 p-6 text-sm text-mist-dim">
      {text}
    </div>
  );
}

function ExposedCategories({ breaches }) {
  const categories = new Set();
  breaches.forEach((b) => b.exposedDataCategories.forEach((c) => categories.add(c)));

  if (categories.size === 0) {
    return <EmptyState text="No exposed data categories were identified." />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {[...categories].map((cat) => (
        <span
          key={cat}
          className={`rounded-md border px-3 py-1.5 font-mono text-xs ${
            /password/i.test(cat)
              ? 'border-warn/40 bg-warn/10 text-warn'
              : 'border-ink-600 bg-ink-800 text-mist-dim'
          }`}
        >
          {cat}
        </span>
      ))}
    </div>
  );
}

function PartialStatusBanner({ stageStatus = {} }) {
  const labels = {
    breach: 'Breach database',
    paste: 'Paste exposure',
    domain: 'Domain security',
    publicExposure: 'Public web search',
    reputation: 'Service analysis',
  };

  return (
    <div className="mb-8 rounded-md border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn">
      <p className="font-medium">Scan partially completed. Some results may be incomplete.</p>
      <ul className="mt-2 space-y-1 font-mono text-xs">
        {Object.entries(stageStatus).map(([key, value]) => (
          <li key={key}>
            {labels[key] || key}: {value === 'completed' || value === 'demo' ? '✓' : value}
          </li>
        ))}
      </ul>
    </div>
  );
}
