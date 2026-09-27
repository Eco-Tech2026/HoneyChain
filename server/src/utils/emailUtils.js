const validator = require('validator');

/**
 * A short, non-exhaustive list of well-known disposable email domains,
 * used only as a local fallback when no disposable-email API key is
 * configured. This is intentionally small — it is a convenience check,
 * not a security boundary.
 */
const KNOWN_DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'yopmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'tempmail.com',
  'trashmail.com',
  'getnada.com',
  'sharklasers.com',
]);

/**
 * Validate an email address's format only. This never checks whether
 * the mailbox exists — TraceGuard must never attempt mailbox
 * verification, login probing, or SMTP handshakes against a real inbox.
 */
function isValidEmailFormat(email) {
  if (typeof email !== 'string' || email.trim().length === 0) return false;
  return validator.isEmail(email.trim());
}

function extractDomain(email) {
  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : null;
}

function isLikelyDisposable(email) {
  const domain = extractDomain(email);
  if (!domain) return false;
  return KNOWN_DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Mask an email address for display/logging, e.g. "na****@gmail.com".
 * Always use this before writing an email to any log line.
 */
function maskEmail(email) {
  if (typeof email !== 'string' || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0] || '*'}***@${domain}`;
  }
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 3))}@${domain}`;
}

module.exports = {
  isValidEmailFormat,
  extractDomain,
  isLikelyDisposable,
  maskEmail,
};
