import test from 'node:test';
import {EventEmitter} from 'node:events';
import httpLoggerCreator from '../src/httpLoggerCreator.js';

test('httpLogger', async () => {
  let req = {
    url: '/',
    method: 'GET',
    headers: {}
  };

  let res = new EventEmitter();
  res.setHeader = () => {
  };

  httpLoggerCreator.create('info')(req, res);
  res.emit('finish');
});
