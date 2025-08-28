console.log('Happy developing ✨');

require('dotenv').config();
const logger = require('./logger.js');
const httpLogger = require('./httpLogger.js');
require('./metrics.js').start();
const http = require('http');

const port = process.env.PORT;
let server;

function start() {
  server = http.createServer((req, res) => {
    httpLogger(req, res);
    res.end('hello world');
  });
  require('./signals.js').fns.push(() => server.close());
  server.listen(port);
  logger.info(`Server is running on http://localhost:${port}`);
  // setTimeout(() => { throw "aaa" }, 1000);
}

start();
