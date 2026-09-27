const { calculateRiskScore } = require('../src/services/riskScoreService');

describe('calculateRiskScore', () => {
  test('returns 0 with no findings', () => {
    const result = calculateRiskScore({ breaches: [], publicExposure: [], domainSecurity: {} });
    expect(result.score).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  test('adds points for confirmed breaches', () => {
    const result = calculateRiskScore({
      breaches: [{ name: 'A', breachDate: '2015-01-01' }],
      publicExposure: [],
      domainSecurity: {},
    });
    expect(result.score).toBeGreaterThan(0);
  });

  test('adds extra points for a recent breach', () => {
    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 1);
    const result = calculateRiskScore({
      breaches: [{ name: 'A', breachDate: recentDate.toISOString() }],
      publicExposure: [],
      domainSecurity: {},
    });
    const oldResult = calculateRiskScore({
      breaches: [{ name: 'A', breachDate: '2010-01-01' }],
      publicExposure: [],
      domainSecurity: {},
    });
    expect(result.score).toBeGreaterThan(oldResult.score);
  });

  test('score never exceeds 100', () => {
    const manyBreaches = Array.from({ length: 20 }, (_, i) => ({
      name: `Service${i}`,
      breachDate: new Date().toISOString(),
      containsPasswordData: true,
      isSensitive: true,
    }));
    const manyExposures = Array.from({ length: 20 }, (_, i) => ({ source: `site${i}` }));
    const result = calculateRiskScore({
      breaches: manyBreaches,
      publicExposure: manyExposures,
      domainSecurity: {
        mx: { status: 'warn' },
        spf: { status: 'warn' },
        dmarc: { status: 'warn' },
        https: { status: 'warn' },
      },
    });
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('includes an explanatory label', () => {
    const result = calculateRiskScore({ breaches: [], publicExposure: [], domainSecurity: {} });
    expect(result.label).toMatch(/informational indicator/i);
  });
});
