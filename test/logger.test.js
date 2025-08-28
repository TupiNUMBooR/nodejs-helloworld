import test from 'node:test';
import logger from '../src/logger.js';

test('logger', async () => {
  logger.info('test');
});
