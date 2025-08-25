console.log('Happy developing ✨')

require('dotenv').config();
const http = require('http');
const port = process.env.PORT || 3000;

http.createServer((req, res) => res.end('ok'))
  .listen(port, () => console.log(`http://localhost:${port}`));
