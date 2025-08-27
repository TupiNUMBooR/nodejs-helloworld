console.log('Happy developing ✨');

require('dotenv').config();
const http = require('http');
const logger = require('./logger.js');
const httpLogger = require('./httpLogger.js');
const port = process.env.PORT || 3000;
let server;

function start() {
  server = http.createServer((req, res) => {
    httpLogger(req, res);
    res.end('hello world');
  });
  server.listen(port, () => console.log(`http://localhost:${port}`));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT',  shutdown);
  logger.info('Server is running on port ' + port);
}

function shutdown(signal) {
  logger.info('shutdown on ' + signal);
  server.close();
  logger.info('shutdown');
}

start();
