require('dotenv').config();
const pino = require('pino');

const {cleanEnv, str, bool} = require('envalid');
const env = cleanEnv(process.env, {
  LOG_LEVEL: str({choices: ['trace', 'debug', 'info', 'warn', 'error']}),
  LOG_PRETTY: bool()
});

const logger = pino({
  level: env.LOG_LEVEL,
  // base: { service: 'nodejs-helloworld' },
  ...(env.LOG_PRETTY && process.stdout.isTTY
    ? {transport: {target: 'pino-pretty', options: {singleLine: true, translateTime: 'SYS:standard'}}}
    : {}),
});

module.exports = logger;
