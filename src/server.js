'use strict';

const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;
const host = '127.0.0.1';

const app = createApp();

const server = app.listen(port, host, () => {
  console.log(`Wave Merge Test listening on http://${host}:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
    process.exit(1);
  }
  throw err;
});
