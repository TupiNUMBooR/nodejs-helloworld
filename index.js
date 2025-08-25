console.log('Happy developing ✨')

require('dotenv').config();
const http = require('http');
const port = process.env.PORT || 3000;

http.createServer((req, res) => res.end('hello world'))
  .listen(port, () => console.log(`http://localhost:${port}`));
