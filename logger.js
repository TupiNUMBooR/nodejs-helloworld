require('dotenv').config();
const pino = require('pino');
const level = process.env.LOG_LEVEL || 'info';

const logger = pino({
  level: level,
  // base: { service: 'nodejs-helloworld' },
  ...(process.env.LOG_PRETTY === '1' && process.stdout.isTTY
    ? { transport: { target: 'pino-pretty', options: { singleLine: true, translateTime: 'SYS:standard' } } }
    : {}),
});

module.exports = logger;
