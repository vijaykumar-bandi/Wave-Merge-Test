'use strict';

const test = require('node:test');
const assert = require('node:assert');
const net = require('node:net');
const path = require('node:path');
const { spawn } = require('node:child_process');

const SERVER_PATH = path.join(__dirname, '..', 'src', 'server.js');

/**
 * Start a fresh copy of src/server.js as a child process with the given
 * environment, so the real bootstrap (PORT handling, host binding, error
 * handling) is exercised rather than a copy of it.
 */
function startServer(env) {
  const child = spawn(process.execPath, [SERVER_PATH], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const output = { stdout: '', stderr: '' };
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    output.stdout += chunk;
  });
  child.stderr.on('data', (chunk) => {
    output.stderr += chunk;
  });

  return { child, output };
}

/** Resolve once the child prints its "listening on" line, or reject on exit. */
function waitForListening(child, output, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Server did not start in time. Output: ${output.stdout}${output.stderr}`));
    }, timeoutMs);

    function onData() {
      const match = output.stdout.match(/listening on http:\/\/([^:]+):(\d+)/);
      if (match) {
        cleanup();
        resolve({ host: match[1], port: Number(match[2]) });
      }
    }

    function onExit(code) {
      cleanup();
      reject(new Error(`Server exited early with code ${code}. Output: ${output.stdout}${output.stderr}`));
    }

    function cleanup() {
      clearTimeout(timer);
      child.stdout.off('data', onData);
      child.off('exit', onExit);
    }

    child.stdout.on('data', onData);
    child.once('exit', onExit);
    onData();
  });
}

/** Stop a child process and wait for it to be gone. */
function stopServer(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }
    child.once('exit', () => resolve());
    child.kill();
  });
}

/** Ask the OS for a free port by binding to port 0 and releasing it. */
function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

test('the server binds to 127.0.0.1 on a port the OS picks', async (t) => {
  const { child, output } = startServer({ PORT: '0' });
  t.after(() => stopServer(child));

  const { host, port } = await waitForListening(child, output);

  assert.strictEqual(host, '127.0.0.1');
  assert.ok(port > 0, `expected a real port, got ${port}`);

  const res = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.strictEqual(res.status, 200);
});

test('PORT is honoured', async (t) => {
  const wanted = await findFreePort();
  const { child, output } = startServer({ PORT: String(wanted) });
  t.after(() => stopServer(child));

  const { host, port } = await waitForListening(child, output);

  assert.strictEqual(host, '127.0.0.1');
  assert.strictEqual(port, wanted);
});

test('an unset PORT falls back to 3000', async (t) => {
  const env = { ...process.env };
  delete env.PORT;

  const child = spawn(process.execPath, [SERVER_PATH], {
    cwd: path.join(__dirname, '..'),
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const output = { stdout: '', stderr: '' };
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    output.stdout += chunk;
  });
  child.stderr.on('data', (chunk) => {
    output.stderr += chunk;
  });
  t.after(() => stopServer(child));

  const { host, port } = await waitForListening(child, output);

  assert.strictEqual(host, '127.0.0.1');
  assert.strictEqual(port, 3000);
});

test('a taken port prints an error and exits with a non-zero code', async (t) => {
  const blocker = net.createServer();
  await new Promise((resolve, reject) => {
    blocker.once('error', reject);
    blocker.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise((resolve) => blocker.close(resolve)));

  const takenPort = blocker.address().port;
  const { child, output } = startServer({ PORT: String(takenPort) });

  const exitCode = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`Server did not exit. Output: ${output.stdout}${output.stderr}`));
    }, 10000);
    child.once('exit', (code) => {
      clearTimeout(timer);
      resolve(code);
    });
  });

  assert.notStrictEqual(exitCode, 0);
  assert.match(output.stderr, new RegExp(`Port ${takenPort} is already in use`));
});
