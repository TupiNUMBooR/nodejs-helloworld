import test from 'node:test';
import assert from 'node:assert';
import server from "../src/server.js";

test('GET /', async () => {
  const port = 18080;
  process.env.PORT = port;
  server.start();

  const res = await fetch(`http://localhost:${port}/`);
  const text = await res.text();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(text, 'hello world');

  server.shutdown();
});
