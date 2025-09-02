const pino = require('pino');
const envalid = require('envalid');

const env = envalid.cleanEnv(process.env, {
  LOG_LEVEL: envalid.str({default: 'info', choices: ['trace', 'debug', 'info', 'warn', 'error']}),
  LOG_PRETTY: envalid.bool({default: false})
});

const logger = pino({
  level: env.LOG_LEVEL,
  // base: { service: 'nodejs-helloworld' },
  ...(env.LOG_PRETTY || process.stdout.isTTY
    ? {transport: {target: 'pino-pretty', options: {singleLine: true, translateTime: 'SYS:standard'}}}
    : {}),
});

module.exports = logger;
