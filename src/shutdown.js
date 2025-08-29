const logger = require("./logger");
const hooks = [];

function onShutdown(fn) {
  hooks.push(fn);
}

function start() {
  process.on('SIGTERM', shutdownOnSignal);
  process.on('SIGINT', shutdownOnSignal);

  process.on('unhandledRejection', e => shutdownOnError('unhandledRejection', e));
  process.on('uncaughtException', e => shutdownOnError('uncaughtException', e));
}

async function shutdownOnSignal(signal) {
  logger.info(`shutdown on ${signal}`);
  await runHooks();
}

async function shutdownOnError(errorType, error) {
  logger.error(`shutdown on ${errorType}: "${error}"`);
  await runHooks();
  process.exit(101);
}

async function runHooks() {
  for (let fn of hooks) {
    try {
      await fn();
    } catch (e) {
      logger.warn(`shutdown hook failed on: "${e}"`);
    }
  }
}

start();
module.exports = {onShutdown};
