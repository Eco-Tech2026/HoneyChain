const rateLimit = require('express-rate-limit');

function buildScanRateLimiter() {
  const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 60);
  const maxScans = Number(process.env.RATE_LIMIT_MAX_SCANS_PER_IP || 5);

  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxScans,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      error: 'RATE_LIMITED',
      message: `Too many scans from this network. Please try again in a bit (limit: ${maxScans} per ${windowMinutes} minutes).`,
    },
  });
}

module.exports = buildScanRateLimiter;
