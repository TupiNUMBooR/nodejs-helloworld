console.log('Happy developing ✨');

require('dotenv').config();
const logger = require('./logger.js');
const httpLogger = require('./httpLogger.js');
require('./metrics.js').start();
const http = require('http');
const {cleanEnv, num} = require('envalid');

const env = cleanEnv(process.env, {
  PORT: num()
});

let server;

function start() {
  server = http.createServer((req, res) => {
    httpLogger(req, res);
    res.end('hello world');
  });
  require('./shutdown.js').onShutdown(() => server.close());
  server.listen(env.PORT);
  logger.info(`Server is running on http://localhost:${(env.PORT)}`);
  // setTimeout(() => { throw "aaa" }, 1000);
}

start();
