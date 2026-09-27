const ScanService = require('../services/scanService');
const logger = require('../utils/logger');
const { maskEmail } = require('../utils/emailUtils');

function buildScanService() {
  return new ScanService({
    demoMode: process.env.DEMO_MODE === 'true' || !process.env.HIBP_API_KEY,
    hibpApiKey: process.env.HIBP_API_KEY,
    searchApiKey: process.env.SEARCH_API_KEY,
    searchApiUrl: process.env.SEARCH_API_URL,
  });
}

async function postScan(req, res) {
  const { email } = req.body;

  try {
    const scanService = buildScanService();
    const result = await scanService.runScan(email);
    return res.status(200).json(result);
  } catch (err) {
    logger.error('Scan failed unexpectedly', { email: maskEmail(email), error: err.message });
    return res.status(500).json({
      status: 'error',
      error: 'SCAN_FAILED',
      message: 'Something went wrong while running the scan. Please try again shortly.',
    });
  }
}

module.exports = { postScan, buildScanService };
