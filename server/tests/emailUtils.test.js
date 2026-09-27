const { isValidEmailFormat, maskEmail, extractDomain, isLikelyDisposable } = require('../src/utils/emailUtils');

describe('isValidEmailFormat', () => {
  test('accepts a normal email', () => {
    expect(isValidEmailFormat('normal@email.com')).toBe(true);
  });

  test('rejects an email missing a domain', () => {
    expect(isValidEmailFormat('invalid@email')).toBe(false);
  });

  test('rejects an empty string', () => {
    expect(isValidEmailFormat('')).toBe(false);
  });

  test('rejects non-string input', () => {
    expect(isValidEmailFormat(undefined)).toBe(false);
    expect(isValidEmailFormat(null)).toBe(false);
  });

  test('accepts test@example.com', () => {
    expect(isValidEmailFormat('test@example.com')).toBe(true);
  });

  test('rejects a very long malformed address', () => {
    const longLocal = 'a'.repeat(300);
    expect(isValidEmailFormat(`${longLocal}@example`)).toBe(false);
  });
});

describe('extractDomain', () => {
  test('extracts domain correctly', () => {
    expect(extractDomain('user@example.com')).toBe('example.com');
  });

  test('returns null for malformed input', () => {
    expect(extractDomain('not-an-email')).toBeNull();
  });
});

describe('maskEmail', () => {
  test('masks a typical email', () => {
    expect(maskEmail('nadia@gmail.com')).toBe('na***@gmail.com');
  });

  test('masks a very short local part', () => {
    const masked = maskEmail('a@example.com');
    expect(masked.endsWith('@example.com')).toBe(true);
    expect(masked).not.toContain('a@example.com');
  });

  test('handles invalid input gracefully', () => {
    expect(maskEmail('not-an-email')).toBe('***');
  });
});

describe('isLikelyDisposable', () => {
  test('flags a known disposable domain', () => {
    expect(isLikelyDisposable('test@mailinator.com')).toBe(true);
  });

  test('does not flag a normal domain', () => {
    expect(isLikelyDisposable('test@gmail.com')).toBe(false);
  });
});
