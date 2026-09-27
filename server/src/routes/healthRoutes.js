const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    demoMode: process.env.DEMO_MODE === 'true' || !process.env.HIBP_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
