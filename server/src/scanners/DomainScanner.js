const dns = require('dns').promises;
const https = require('https');
const { DEMO_DOMAIN_SECURITY } = require('./demoData');
const logger = require('../utils/logger');

/**
 * DomainScanner performs legitimate, public DNS lookups against the
 * email's domain — the same records anyone can query with `dig`. It
 * never touches the individual mailbox and never implies that domain
 * configuration reflects the security of any one person's account.
 */
class DomainScanner {
  constructor({ demoMode } = {}) {
    this.demoMode = demoMode;
  }

  async scan(domain) {
    if (this.demoMode) {
      return { status: 'demo', ...DEMO_DOMAIN_SECURITY, domain };
    }

    const [mx, spf, dmarc, httpsResult] = await Promise.all([
      this._checkMx(domain),
      this._checkSpf(domain),
      this._checkDmarc(domain),
      this._checkHttps(domain),
    ]);

    return {
      status: 'completed',
      domain,
      mx,
      spf,
      dmarc,
      dkim: {
        status: 'unknown',
        label: 'Could not verify',
        detail:
          'DKIM has no fixed DNS location — it depends on a provider-specific selector, so it cannot be reliably checked without knowing the mail provider.',
      },
      https: httpsResult,
      domainAgeYears: null,
    };
  }

  async _checkMx(domain) {
    try {
      const records = await dns.resolveMx(domain);
      return records.length > 0
        ? { status: 'ok', label: 'Configured', detail: `${records.length} MX record(s) found` }
        : { status: 'warn', label: 'Not configured', detail: 'No MX records found' };
    } catch (err) {
      return { status: 'warn', label: 'Not configured', detail: 'No MX records found' };
    }
  }

  async _checkSpf(domain) {
    try {
      const records = await dns.resolveTxt(domain);
      const flat = records.map((r) => r.join(''));
      const spfRecord = flat.find((r) => r.startsWith('v=spf1'));
      if (!spfRecord) {
        return { status: 'warn', label: 'Not configured', detail: 'No SPF TXT record found' };
      }
      return { status: 'ok', label: 'Configured', detail: 'SPF record present' };
    } catch (err) {
      return { status: 'warn', label: 'Not configured', detail: 'No SPF TXT record found' };
    }
  }

  async _checkDmarc(domain) {
    try {
      const records = await dns.resolveTxt(`_dmarc.${domain}`);
      const flat = records.map((r) => r.join(''));
      const dmarcRecord = flat.find((r) => r.startsWith('v=DMARC1'));
      if (!dmarcRecord) {
        return { status: 'warn', label: 'Not configured', detail: 'No DMARC record found' };
      }
      const policyMatch = dmarcRecord.match(/p=([a-zA-Z]+)/);
      const policy = policyMatch ? policyMatch[1].toLowerCase() : 'unknown';
      if (policy === 'none') {
        return { status: 'warn', label: 'Policy weak', detail: 'DMARC record present with policy "none"' };
      }
      if (policy === 'quarantine' || policy === 'reject') {
        return { status: 'ok', label: 'Configured', detail: `DMARC policy set to "${policy}"` };
      }
      return { status: 'warn', label: 'Policy unclear', detail: dmarcRecord };
    } catch (err) {
      return { status: 'warn', label: 'Not configured', detail: 'No DMARC record found' };
    }
  }

  _checkHttps(domain) {
    return new Promise((resolve) => {
      const req = https.request(
        { host: domain, method: 'HEAD', timeout: 5000, path: '/' },
        (res) => {
          resolve({ status: 'ok', label: 'Available', detail: `HTTPS reachable (status ${res.statusCode})` });
          res.resume();
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 'unknown', label: 'Could not verify', detail: 'HTTPS request timed out' });
      });
      req.on('error', (err) => {
        resolve({ status: 'warn', label: 'Unavailable', detail: 'HTTPS did not respond' });
      });
      req.end();
    });
  }
}

module.exports = DomainScanner;
