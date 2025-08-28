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

function shutdownOnSignal(signal) {
  logger.info(`shutdown on ${signal}`);
  runHooks();
}

function shutdownOnError(errorType, error) {
  logger.error(`shutdown on ${errorType}: "${error}"`);
  runHooks();
  process.exit(101);
}

function runHooks() {
  for (let fn of hooks) fn();
}

start();
module.exports = {onShutdown};
