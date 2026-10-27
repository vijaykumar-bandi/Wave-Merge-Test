'use strict';

const path = require('node:path');
const express = require('express');
const healthRouter = require('./routes/health');

/**
 * Build a configured Express app without listening on a port, so tests can
 * mount it directly.
 */
function createApp() {
  const app = express();

  // Serve the static home page from public/ (index.html answers GET /).
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Health endpoint.
  app.use('/api/health', healthRouter);

  // 404 handler: plain text, no HTML page.
  app.use((req, res) => {
    res.status(404).type('text/plain').send('Not found.');
  });

  // 500 handler: plain text, no HTML page.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).type('text/plain').send('Something went wrong.');
  });

  return app;
}

module.exports = { createApp };
