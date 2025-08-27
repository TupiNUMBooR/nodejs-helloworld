console.log('Happy developing ✨');

require('dotenv').config();
const http = require('http');
const logger = require('./logger.js');
const httpLogger = require('./httpLogger.js');
const port = process.env.PORT || 3000;
let server;

function start() {
  handleSignals();
  server = http.createServer((req, res) => {
    httpLogger(req, res);
    res.end('hello world');
  });
  server.listen(port, () => console.log(`http://localhost:${port}`));
  logger.info('Server is running on port ' + port);
}

function handleSignals() {
  process.on('SIGTERM', shutdown);
  process.on('SIGINT',  shutdown);
  process.on('unhandledRejection', e => shutdownOnError('unhandledRejection', e));
  process.on('uncaughtException', e => shutdownOnError('uncaughtException', e));
}

function shutdown(signal) {
  logger.info('shutdown on ' + signal);
  server.close();
}

function shutdownOnError(errorType, error) {
  logger.error('shutdown on '+ errorType +': "' + error + '"');
  server.close();
  process.exit(101);
}

start();
