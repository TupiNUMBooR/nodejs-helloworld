console.log('Happy developing ✨');

require('dotenv').config();
require('./metrics.js').start();
require('./server.js').start();
