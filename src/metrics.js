const http = require('node:http');
const client = require('prom-client');
const logger = require('./logger');
const httpLogger = require('./httpLogger');
const {cleanEnv, num} = require('envalid');
let server;

client.collectDefaultMetrics();

function start() {
  const env = cleanEnv(process.env, {
    METRICS_PORT: num()
  });

  server = http.createServer(async (req, res) => {
    httpLogger(req, res);

    if (req.url === '/healthz') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('healthy');
    } else if (req.url === '/metrics') {
      res.writeHead(200, {'Content-Type': client.register.contentType});
      res.end(await client.register.metrics());
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('not found');
    }
  });

  require('./shutdown.js').onShutdown(() => shutdown());

  server.listen(env.METRICS_PORT, () => {
    logger.info(`metrics server: http://localhost:${(env.METRICS_PORT)}/metrics`);
  });
}

function shutdown() {
  logger.info('metrics shutdown');
  server.close();
}

module.exports = {start, shutdown};
