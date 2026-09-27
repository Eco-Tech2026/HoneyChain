/**
 * PasteExposureScanner checks for the email appearing in public paste
 * sites (Pastebin-style dumps). Most legitimate paste-search APIs are
 * either discontinued or require a paid enterprise agreement, so this
 * scanner is structured to plug into one but defaults to reporting
 * itself as unavailable outside demo mode rather than scraping paste
 * sites directly (which would violate their terms of use).
 */
class PasteExposureScanner {
  constructor({ demoMode, apiKey } = {}) {
    this.demoMode = demoMode;
    this.apiKey = apiKey;
  }

  async scan(email) {
    if (this.demoMode) {
      return {
        status: 'demo',
        pastes: [
          {
            source: 'Sample Paste Archive',
            dateSeen: '2020-05-14',
            detected: 'Email address',
          },
        ],
      };
    }

    if (!this.apiKey) {
      return {
        status: 'unavailable',
        reason:
          'No paste-exposure provider is configured. This scanner will activate automatically once a legitimate provider API key is added.',
        pastes: [],
      };
    }

    // Intentionally left as an extension point: wire in a licensed
    // paste-search provider here, following its API terms and rate
    // limits. Never scrape paste sites directly.
    return { status: 'unavailable', reason: 'Provider integration not implemented', pastes: [] };
  }
}

module.exports = PasteExposureScanner;
