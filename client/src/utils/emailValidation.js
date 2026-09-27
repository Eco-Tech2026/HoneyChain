const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function validateEmail(rawEmail) {
  const email = (rawEmail || '').trim();

  if (email.length === 0) {
    return { valid: false, message: '', tone: 'idle' };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, message: 'Please enter a valid email address.', tone: 'error' };
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && KNOWN_DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: true, message: 'Disposable email provider detected.', tone: 'warn' };
  }

  return { valid: true, message: 'Valid email address.', tone: 'ok' };
}
