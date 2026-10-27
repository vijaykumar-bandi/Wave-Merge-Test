'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

test('GET / answers 200', async (t) => {
  const app = createApp();
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/`);

  assert.strictEqual(res.status, 200);
  const body = await res.text();
  assert.match(body, /Wave Merge Test/);
});
