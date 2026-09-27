const { isValidEmailFormat } = require('../utils/emailUtils');

function validateScanRequest(req, res, next) {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({
      status: 'error',
      error: 'MISSING_EMAIL',
      message: 'Please enter an email address.',
    });
  }

  if (email.length > 254) {
    return res.status(400).json({
      status: 'error',
      error: 'EMAIL_TOO_LONG',
      message: 'Please enter a valid email address.',
    });
  }

  if (!isValidEmailFormat(email)) {
    return res.status(400).json({
      status: 'error',
      error: 'INVALID_EMAIL',
      message: 'Please enter a valid email address.',
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
}

module.exports = validateScanRequest;
