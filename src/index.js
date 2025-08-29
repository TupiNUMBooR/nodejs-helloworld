console.log('Happy developing ✨');

require('dotenv-flow').config();
require('./metrics').start();
require('./server').start();
require('./telegramBot').start();
require('./openai').ask();
