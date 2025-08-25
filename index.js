console.log('Happy developing ✨')

require('dotenv').config();
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => res.end('hello world'));

function shutdown(signal) {
  console.log('shutdown on ' + signal);
  server.close();
  console.log('shutdown');
}

server.listen(port, () => console.log(`http://localhost:${port}`));
process.on('SIGTERM', shutdown);
process.on('SIGINT',  shutdown);
