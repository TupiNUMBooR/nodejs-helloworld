require('dotenv').config();
const pinoHttp = require('pino-http');
const { randomUUID } = require('node:crypto');
const logger = require('./logger.js');

function create(level) {
  return pinoHttp({
    logger,
    genReqId(req, res) {
      const id = req.headers['x-request-id'] || randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
    useLevel: level
  });
}

module.exports = {create};
