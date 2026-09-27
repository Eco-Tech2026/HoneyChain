require('dotenv').config();
const createApp = require('./app');

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  const demoMode = process.env.DEMO_MODE === 'true' || !process.env.HIBP_API_KEY;
  // eslint-disable-next-line no-console
  console.log(`TraceGuard server running on port ${PORT} ${demoMode ? '(DEMO MODE)' : '(LIVE MODE)'}`);
});
