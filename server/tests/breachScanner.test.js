const BreachScanner = require('../src/scanners/BreachScanner');

describe('BreachScanner (demo mode)', () => {
  test('returns demo status and sample breaches', async () => {
    const scanner = new BreachScanner({ demoMode: true });
    const result = await scanner.scan('someone@example.com');
    expect(result.status).toBe('demo');
    expect(Array.isArray(result.breaches)).toBe(true);
    expect(result.breaches.length).toBeGreaterThan(0);
  });

  test('never exposes raw credential-like data classes', async () => {
    const scanner = new BreachScanner({ demoMode: true });
    const result = await scanner.scan('someone@example.com');
    for (const breach of result.breaches) {
      for (const category of breach.exposedDataCategories) {
        expect(category.toLowerCase()).not.toMatch(/hash|plaintext|actual password/);
      }
    }
  });
});

describe('BreachScanner (no API key, not demo mode)', () => {
  test('reports unavailable rather than failing', async () => {
    const scanner = new BreachScanner({ demoMode: false, apiKey: undefined });
    const result = await scanner.scan('someone@example.com');
    expect(result.status).toBe('unavailable');
    expect(result.breaches).toEqual([]);
  });
});
