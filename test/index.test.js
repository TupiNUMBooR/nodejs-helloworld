import test from 'node:test';
import assert from 'node:assert';

test('GET / => 200 ok "hello world"', async () => {
  const res = await fetch('http://localhost:3002');
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert.strictEqual(text, 'hello world');
});
