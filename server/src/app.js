const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const scanRoutes = require('./routes/scanRoutes');
const healthRoutes = require('./routes/healthRoutes');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    })
  );
  app.use(express.json({ limit: '10kb' }));

  // Basic request timeout safeguard.
  app.use((req, res, next) => {
    res.setTimeout(15000, () => {
      res.status(503).json({
        status: 'error',
        error: 'REQUEST_TIMEOUT',
        message: 'The request took too long to process.',
      });
    });
    next();
  });

  app.use('/api', healthRoutes);
  app.use('/api', scanRoutes);

  app.use((req, res) => {
    res.status(404).json({ status: 'error', error: 'NOT_FOUND', message: 'Route not found.' });
  });

  // Centralized error handler.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(500).json({
      status: 'error',
      error: 'SERVER_ERROR',
      message: 'An unexpected server error occurred.',
    });
  });

  return app;
}

module.exports = createApp;
