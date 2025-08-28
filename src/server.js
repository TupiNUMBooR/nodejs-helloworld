const logger = require('./logger.js');
const httpLogger = require('./httpLogger.js').create('debug');
const http = require('http');
const {cleanEnv, num} = require('envalid');

let server;

function start() {
  const env = cleanEnv(process.env, {
    PORT: num()
  });

  server = http.createServer((req, res) => {
    httpLogger(req, res);
    res.end('hello world');
  });
  require('./shutdown.js').onShutdown(() => shutdown());
  server.listen(env.PORT);
  logger.info(`Server is running on http://localhost:${(env.PORT)}`);
  // setTimeout(() => { throw "aaa" }, 1000);
}

function shutdown() {
  logger.info(`Server shutdown`);
  server.close();
}

module.exports = {server, start, shutdown};
