'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const PAGE_PATH = path.join(__dirname, '..', 'public', 'index.html');

/** Read the home page and return its inline script source. */
function readPageScript() {
  const html = fs.readFileSync(PAGE_PATH, 'utf8');
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match, 'public/index.html should hold an inline <script>');
  return match[1];
}

/**
 * A tiny hand-written DOM stub: just the elements the page script touches,
 * with getElementById, addEventListener, textContent and classList.
 */
function createDom() {
  function element(id, tagName) {
    return {
      id,
      tagName,
      textContent: '',
      listeners: {},
      classList: { add() {}, remove() {} },
      addEventListener(type, handler) {
        (this.listeners[type] = this.listeners[type] || []).push(handler);
      },
      dispatch(type, event = {}) {
        for (const handler of this.listeners[type] || []) handler(event);
      },
    };
  }

  const elements = {
    counter: element('counter', 'DIV'),
    'counter-caption': element('counter-caption', 'P'),
    increment: element('increment', 'BUTTON'),
    reset: element('reset', 'BUTTON'),
  };
  elements.counter.textContent = '0';

  const document = {
    getElementById: (id) => elements[id] || null,
    addEventListener() {},
  };

  const window = {
    setTimeout: () => 0,
  };

  return { elements, document, window };
}

/** Load the page script into a fresh DOM stub, as a fresh page load would. */
function loadPage() {
  const dom = createDom();
  const context = vm.createContext({
    document: dom.document,
    window: dom.window,
  });
  vm.runInContext(readPageScript(), context);
  return dom;
}

test('a fresh load shows the counter at 0', () => {
  const { elements } = loadPage();
  assert.strictEqual(elements.counter.textContent, '0');
});

test('one click gives 1', () => {
  const { elements } = loadPage();
  elements.increment.dispatch('click');
  assert.strictEqual(elements.counter.textContent, '1');
});

test('three clicks give 3', () => {
  const { elements } = loadPage();
  elements.increment.dispatch('click');
  elements.increment.dispatch('click');
  elements.increment.dispatch('click');
  assert.strictEqual(elements.counter.textContent, '3');
});

test('a fresh load after clicks starts again at 0', () => {
  const first = loadPage();
  first.elements.increment.dispatch('click');
  first.elements.increment.dispatch('click');
  assert.strictEqual(first.elements.counter.textContent, '2');

  const second = loadPage();
  assert.strictEqual(second.elements.counter.textContent, '0');
});

test('the page script sends and stores nothing', () => {
  const script = readPageScript();
  assert.doesNotMatch(script, /\bfetch\s*\(/);
  assert.doesNotMatch(script, /\bXMLHttpRequest\b/);
  assert.doesNotMatch(script, /\blocalStorage\b/);
});
