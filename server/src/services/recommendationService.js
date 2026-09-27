/**
 * Turns scan findings into plain-language recommendations. Never
 * claims that any action retroactively removes historical breach
 * data — only that it reduces ongoing risk.
 */
function generateRecommendations({ breaches = [], publicExposure = [], domainSecurity = {} }) {
  const recommendations = [];

  const hasPasswordExposure = breaches.some((b) => b.containsPasswordData);
  if (hasPasswordExposure) {
    recommendations.push({
      priority: 'high',
      title: 'Change passwords for affected services',
      detail:
        'One or more breaches indicate password-related data was included. Change the password for each affected service and avoid reusing that password anywhere else.',
    });
  }

  if (breaches.length > 1) {
    recommendations.push({
      priority: 'high',
      title: 'Use a unique password for every important account',
      detail:
        'This email appears in multiple breaches. A password manager makes it practical to use a different, strong password for each account.',
    });
  }

  if (breaches.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Enable multi-factor authentication where available',
      detail:
        'Turning on MFA for important accounts (email, banking, primary social accounts) significantly reduces the impact of a leaked password.',
    });
  }

  if (publicExposure.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Consider requesting removal of publicly exposed listings',
      detail:
        'Some public pages reference this email address. Many sites and data brokers offer a removal or opt-out request process.',
    });
  }

  const dmarc = domainSecurity.dmarc;
  if (dmarc && dmarc.status === 'warn') {
    recommendations.push({
      priority: 'low',
      title: 'Strengthen the domain\u2019s DMARC policy',
      detail:
        'If you control this domain, consider moving its DMARC policy from "none" toward "quarantine" or "reject" to reduce spoofing risk.',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'low',
      title: 'No urgent action identified from current findings',
      detail:
        'Good general hygiene still applies: use unique passwords, enable MFA where possible, and re-check periodically since new exposures can appear over time.',
    });
  }

  return recommendations;
}

module.exports = { generateRecommendations };
