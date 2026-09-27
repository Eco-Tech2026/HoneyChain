const { DEMO_SERVICE_ASSOCIATIONS } = require('./demoData');

/**
 * ReputationScanner builds the "Services Associated With This Email"
 * section. It NEVER infers an account from the email's domain alone
 * (e.g. it will not assume a Gmail address has a Google account "in
 * use" beyond what a legitimate source confirms), and it never
 * implies a successful login of any kind.
 *
 * Categories:
 *  - confirmed: a legitimate breach source confirmed the email in that
 *    service's compromised dataset (fed in from BreachScanner results)
 *  - publicAssociation: a legitimate public source associates the email
 *    with the service (fed in from PublicMentionScanner results)
 *  - unableToVerify: everything else — explicitly labeled as unknown,
 *    never as "no account"
 */
class ReputationScanner {
  constructor({ demoMode } = {}) {
    this.demoMode = demoMode;
  }

  async build({ breaches = [], publicExposure = [] } = {}) {
    if (this.demoMode) {
      return { status: 'demo', ...DEMO_SERVICE_ASSOCIATIONS };
    }

    const confirmed = breaches.map((b) => ({
      service: b.name,
      reason: 'Confirmed breach exposure',
    }));

    const publicAssociation = publicExposure
      .filter((p) => p.source)
      .map((p) => ({
        service: p.source,
        reason: 'Public association found in an indexed public page',
      }));

    // A short, deliberately conservative watchlist. We only ever say
    // "unable to verify" here — never that an account exists or
    // doesn't. Real implementations may expand this list, but must
    // keep the same "unable to verify" framing absent real evidence.
    const watchlist = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook', 'Instagram'];
    const confirmedNames = new Set(confirmed.map((c) => c.service.toLowerCase()));
    const unableToVerify = watchlist
      .filter((service) => !confirmedNames.has(service.toLowerCase()))
      .map((service) => ({ service, reason: 'Login status cannot be verified' }));

    return { status: 'completed', confirmed, publicAssociation, unableToVerify };
  }
}

module.exports = ReputationScanner;
