console.log('Happy developing ✨');

require('dotenv').config();
const logger = require('./logger.js');
const httpLogger = require('./httpLogger.js');
const http = require('http');
const port = process.env.PORT || 3000;
let server;

function start() {
  server = http.createServer((req, res) => {
    httpLogger(req, res);
    res.end('hello world');
  });
  require('./signals.js').fn = () => server.close()
  server.listen(port);
  logger.info(`Server is running on port ${port}`);
}

start();
