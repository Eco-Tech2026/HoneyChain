const express = require('express');
const { postScan } = require('../controllers/scanController');
const validateScanRequest = require('../middleware/validateScanRequest');
const buildScanRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/scan', buildScanRateLimiter(), validateScanRequest, postScan);

module.exports = router;
