const http = require('http');
const envalid = require('envalid');
const logger = require('./logger');
const httpLoggerCreator = require('./httpLoggerCreator');
const shutdown = require('./shutdown');

const env = envalid.cleanEnv(process.env, {
  PORT: envalid.num()
});
const httpLogger = httpLoggerCreator.create('debug');
let server;

shutdown.onShutdown(() => stop());

function start() {
  server = http.createServer((req, res) => {
    httpLogger(req, res);
    res.end('hello world');
  });
  server.listen(env.PORT);
  logger.info(`Server is running on http://localhost:${(env.PORT)}`);
  // setTimeout(() => { throw "aaa" }, 1000);
}

function stop() {
  if (server) {
    logger.info(`Server shutdown`);
    server.close();
  }
}

module.exports = {server, start, stop};
