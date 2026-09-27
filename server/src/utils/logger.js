const { maskEmail } = require('./emailUtils');

/**
 * A tiny logger wrapper. The important behavior here is not the log
 * format — it's that nothing that logs an email address ever logs the
 * raw value. Every call site should pass the raw email through
 * `maskEmail` first, but we defensively mask again here in case a
 * caller forgets.
 */
function safe(value) {
  if (typeof value === 'string' && value.includes('@') && value.includes('.')) {
    return maskEmail(value);
  }
  return value;
}

const logger = {
  info: (message, meta = {}) => {
    const safeMeta = Object.fromEntries(
      Object.entries(meta).map(([k, v]) => [k, safe(v)])
    );
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, safeMeta);
  },
  warn: (message, meta = {}) => {
    const safeMeta = Object.fromEntries(
      Object.entries(meta).map(([k, v]) => [k, safe(v)])
    );
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, safeMeta);
  },
  error: (message, meta = {}) => {
    const safeMeta = Object.fromEntries(
      Object.entries(meta).map(([k, v]) => [k, safe(v)])
    );
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, safeMeta);
  },
};

module.exports = logger;
