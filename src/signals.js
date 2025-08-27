const logger = require("./logger");
let fn = {
    "fn": () => {
        throw "Must declare closing function"
    }
}

function handleSignals() {
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('unhandledRejection', e => shutdownOnError('unhandledRejection', e));
    process.on('uncaughtException', e => shutdownOnError('uncaughtException', e));
}

function shutdown(signal) {
    logger.info(`shutdown on ${signal}`);
    fn.fn();
}

function shutdownOnError(errorType, error) {
    logger.error(`shutdown on ${errorType}: "${error}"`);
    fn.fn();
    process.exit(101);
}

handleSignals();

module.exports = fn;
