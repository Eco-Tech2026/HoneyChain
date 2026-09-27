const fetch = require('node-fetch');
const { DEMO_PUBLIC_EXPOSURE } = require('./demoData');
const logger = require('../utils/logger');

/**
 * PublicMentionScanner looks for the email in publicly indexed web
 * pages via a legitimate search API (e.g. Bing Web Search, SerpAPI —
 * anything that returns results it is licensed to return).
 *
 * It never scrapes sites directly, never targets login-protected or
 * private pages, and never queries data-broker databases that
 * prohibit automated access. If no provider is configured, it simply
 * reports itself as unavailable rather than falling back to scraping.
 */
class PublicMentionScanner {
  constructor({ demoMode, apiKey, apiUrl } = {}) {
    this.demoMode = demoMode;
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async scan(email) {
    if (this.demoMode) {
      return { status: 'demo', results: DEMO_PUBLIC_EXPOSURE };
    }

    if (!this.apiKey || !this.apiUrl) {
      return {
        status: 'unavailable',
        reason: 'No public search provider is configured (SEARCH_API_KEY / SEARCH_API_URL)',
        results: [],
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(`"${email}"`)}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 10000,
      });

      if (!response.ok) {
        return { status: 'error', reason: `Search provider returned ${response.status}`, results: [] };
      }

      const data = await response.json();
      const rawResults = Array.isArray(data.results) ? data.results : [];

      const results = rawResults.slice(0, 10).map((r) => ({
        source: r.title || r.source || 'Public webpage',
        type: 'Public webpage',
        detected: 'Email address',
        risk: this._estimateRisk(r.url || ''),
        dateSeen: r.date || null,
        url: r.url || null,
      }));

      return { status: 'completed', results };
    } catch (err) {
      logger.error('PublicMentionScanner failed', { error: err.message });
      return { status: 'error', reason: 'Public search request failed or timed out', results: [] };
    }
  }

  _estimateRisk(url) {
    if (/pastebin|paste\.|dump/i.test(url)) return 'High';
    if (/forum|social|comment/i.test(url)) return 'Medium';
    return 'Low';
  }
}

module.exports = PublicMentionScanner;
