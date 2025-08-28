import test from 'node:test';
import assert from 'node:assert';
import metrics from '../src/metrics.js';

test('GET /healthz', async () => {
  let port = process.env.METRICS_PORT;
  metrics.start();

  const res = await fetch(`http://localhost:${port}/healthz`);
  const text = await res.text();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(text, 'healthy');

  metrics.stop();
});

test('GET /metrics', async () => {
  let port = process.env.METRICS_PORT;
  metrics.start();

  const res = await fetch(`http://localhost:${port}/metrics`);
  const text = await res.text();

  assert.strictEqual(res.status, 200);
  assert.match(text, /# HELP process_cpu_user_seconds_total/);

  metrics.stop();
});
