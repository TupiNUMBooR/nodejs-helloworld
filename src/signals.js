const logger = require("./logger");
let signals = {
  fns: []
}

function handleSignals() {
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  process.on('unhandledRejection', e => shutdownOnError('unhandledRejection', e));
  process.on('uncaughtException', e => shutdownOnError('uncaughtException', e));
}

function shutdown(signal) {
  logger.info(`shutdown on ${signal}`);
  onShutdown();
}

function shutdownOnError(errorType, error) {
  logger.error(`shutdown on ${errorType}: "${error}"`);
  onShutdown();
  process.exit(101);
}

function onShutdown() {
  for (let fn of signals.fns) {
    fn();
  }
}

handleSignals();

module.exports = signals;
