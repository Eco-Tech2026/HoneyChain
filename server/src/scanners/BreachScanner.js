const fetch = require('node-fetch');
const { DEMO_BREACHES } = require('./demoData');
const logger = require('../utils/logger');

const HIBP_BASE_URL = 'https://haveibeenpwned.com/api/v3';

/**
 * BreachScanner queries a legitimate breach-data provider (Have I Been
 * Pwned) to find CONFIRMED breach exposure for an email address.
 *
 * It never attempts to log in anywhere, never guesses passwords, and
 * never returns actual password/credential values — only the
 * *categories* of data a breach reportedly exposed.
 */
class BreachScanner {
  constructor({ apiKey, demoMode } = {}) {
    this.apiKey = apiKey;
    this.demoMode = demoMode;
  }

  async scan(email) {
    if (this.demoMode) {
      return {
        status: 'demo',
        breaches: DEMO_BREACHES.map(this._sanitizeBreach),
      };
    }

    if (!this.apiKey) {
      return {
        status: 'unavailable',
        reason: 'HIBP_API_KEY is not configured',
        breaches: [],
      };
    }

    try {
      const response = await fetch(
        `${HIBP_BASE_URL}/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
        {
          headers: {
            'hibp-api-key': this.apiKey,
            'user-agent': 'TraceGuard-Email-Scanner',
          },
          timeout: 10000,
        }
      );

      if (response.status === 404) {
        // No breach found — this is a normal, non-error outcome.
        return { status: 'completed', breaches: [] };
      }

      if (response.status === 401) {
        return { status: 'error', reason: 'Invalid HIBP API key', breaches: [] };
      }

      if (response.status === 429) {
        return { status: 'rate_limited', reason: 'HIBP rate limit reached', breaches: [] };
      }

      if (!response.ok) {
        return { status: 'error', reason: `Unexpected HIBP status ${response.status}`, breaches: [] };
      }

      const data = await response.json();
      const breaches = data.map((b) => this._sanitizeBreach({
        name: b.Title || b.Name,
        domain: b.Domain,
        breachDate: b.BreachDate,
        addedDate: b.AddedDate,
        description: this._stripHtml(b.Description || ''),
        dataClasses: b.DataClasses || [],
        isSensitive: !!b.IsSensitive,
        containsPasswordData: (b.DataClasses || []).some((c) =>
          /password/i.test(c)
        ),
      }));

      return { status: 'completed', breaches };
    } catch (err) {
      logger.error('BreachScanner failed', { error: err.message });
      return { status: 'error', reason: 'Breach database request failed or timed out', breaches: [] };
    }
  }

  _stripHtml(text) {
    return text.replace(/<[^>]*>/g, '');
  }

  /**
   * Ensures no credential-like values ever leave this scanner — only
   * category labels. This is a hard safety boundary, not just a
   * display-layer concern, so it lives here at the data source.
   */
  _sanitizeBreach(breach) {
    const categories = (breach.dataClasses || []).map((c) => {
      if (/password|credential|hash|token|cookie|session/i.test(c)) {
        return 'Password-related data';
      }
      return c;
    });

    return {
      name: breach.name,
      domain: breach.domain || null,
      breachDate: breach.breachDate || null,
      addedDate: breach.addedDate || null,
      description: breach.description || '',
      exposedDataCategories: [...new Set(categories)],
      containsPasswordData: !!breach.containsPasswordData,
      isSensitive: !!breach.isSensitive,
    };
  }
}

module.exports = BreachScanner;
