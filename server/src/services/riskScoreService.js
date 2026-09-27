/**
 * Calculates a transparent "exposure score" out of 100. Every point
 * added is explainable — the caller gets both the total and the
 * itemized breakdown, so the UI can show "Why is my score X?"
 *
 * This is an informational heuristic, not a validated security
 * metric, and every consumer of this score must present it as such.
 */
function calculateRiskScore({ breaches = [], publicExposure = [], domainSecurity = {} }) {
  const breakdown = [];
  let score = 0;

  if (breaches.length > 0) {
    const points = Math.min(breaches.length * 10, 30);
    score += points;
    breakdown.push({
      points,
      label: breaches.length === 1 ? '1 confirmed breach' : `${breaches.length} confirmed breaches`,
    });
  }

  const recentBreach = breaches.some((b) => {
    if (!b.breachDate) return false;
    const years = (Date.now() - new Date(b.breachDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    return years <= 2;
  });
  if (recentBreach) {
    score += 15;
    breakdown.push({ points: 15, label: 'A breach occurred within the last 2 years' });
  }

  const hasSensitiveCategory = breaches.some(
    (b) =>
      b.containsPasswordData ||
      b.isSensitive ||
      (b.exposedDataCategories || []).some((c) => /password|financial|ssn|social security|health/i.test(c))
  );
  if (hasSensitiveCategory) {
    score += 10;
    breakdown.push({ points: 10, label: 'A sensitive data category was exposed' });
  }

  if (publicExposure.length > 0) {
    const points = Math.min(publicExposure.length * 8, 20);
    score += points;
    breakdown.push({
      points,
      label:
        publicExposure.length === 1
          ? '1 public exposure reference found'
          : `${publicExposure.length} public exposure references found`,
    });
  }

  const domainWarnings = ['mx', 'spf', 'dmarc', 'https']
    .map((key) => domainSecurity[key])
    .filter((entry) => entry && entry.status === 'warn').length;
  if (domainWarnings > 0) {
    const points = Math.min(domainWarnings * 5, 15);
    score += points;
    breakdown.push({
      points,
      label:
        domainWarnings === 1
          ? '1 domain security signal needs attention'
          : `${domainWarnings} domain security signals need attention`,
    });
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: finalScore,
    label: 'TraceGuard exposure score — an informational indicator, not a definitive security rating.',
    breakdown,
  };
}

module.exports = { calculateRiskScore };
