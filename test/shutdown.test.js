import test from 'node:test';
import assert from 'node:assert/strict';
import shutdown from '../src/shutdown.js';

test('shutdown on SIGTERM', () => {
  let called = [];
  shutdown.onShutdown(() => called.push('a'));
  shutdown.onShutdown(() => called.push('b'));

  process.emit('SIGTERM', 'SIGTERM');

  assert.deepEqual(called, ['a', 'b']);
});

test('shutdown on unhandledRejection', () => {
  let exit = process.exit
  try {
    let called = [];
    shutdown.onShutdown(() => called.push('a'));

    process.exit = n => {
      throw n
    };
    assert.throws(() => {
      process.emit('unhandledRejection', 'some error');
    }, /101/)

    assert.deepEqual(called, ['a']);
  } finally {
    process.exit = exit;
  }
});
