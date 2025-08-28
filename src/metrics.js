const http = require('http');
const client = require('prom-client');
const envalid = require('envalid');
const shutdown = require('./shutdown');
const logger = require('./logger');
const httpLoggerCreator = require('./httpLoggerCreator');

const env = envalid.cleanEnv(process.env, {
  METRICS_PORT: envalid.num()
});
const httpLogger = httpLoggerCreator.create('trace');
let server;

shutdown.onShutdown(() => stop());
client.collectDefaultMetrics();

function start() {
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

  server.listen(env.METRICS_PORT, () => {
    logger.info(`metrics server: http://localhost:${(env.METRICS_PORT)}/metrics`);
  });
}

function stop() {
  if (server) {
    logger.info('metrics shutdown');
    server.close();
  }
}

module.exports = {start, stop};
