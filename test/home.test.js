'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

/** Start the app on a free port the OS picks, and close it after the test. */
async function startApp(t) {
  const app = createApp();
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

test('GET / answers 200 with the heading "Wave Merge Test"', async (t) => {
  const base = await startApp(t);

  const res = await fetch(`${base}/`);
  assert.strictEqual(res.status, 200);

  const body = await res.text();
  assert.match(body, /<h1>\s*Wave Merge Test\s*<\/h1>/);
});

test('GET / shows a counter at 0', async (t) => {
  const base = await startApp(t);

  const res = await fetch(`${base}/`);
  const body = await res.text();

  assert.match(body, /id="counter"[^>]*>0</);
});
