import test from 'node:test';
import httpLogger from '../src/httpLogger.js';
import { EventEmitter } from 'node:events';

test('httpLogger', async () => {
  let req = {
    url: '/',
    method: 'GET',
    headers: {}
  };

  let res = new EventEmitter();
  res.setHeader = () => {};

  httpLogger(req, res);
  res.emit('finish');
});
