const http = require('node:http');
const client = require('prom-client');
const logger = require('./logger');
const httpLogger = require('./httpLogger');

const port = process.env.METRICS_PORT;

client.collectDefaultMetrics();

function start() {
  const server = http.createServer(async (req, res) => {
    httpLogger(req, res);

    if (req.url === '/healthz') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('ok');
    } else if (req.url === '/metrics') {
      res.writeHead(200, {'Content-Type': client.register.contentType});
      res.end(await client.register.metrics());
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('not found');
    }
  });

  require('./shutdown.js').onShutdown(() => server.close());

  server.listen(port, () => {
    logger.info(`metrics server: http://localhost:${port}/metrics`);
  });
}

module.exports = {start};
