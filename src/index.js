console.log('Happy developing ✨');

require('dotenv-flow').config();
require('./metrics').start();
require('./server').start();
(async () => {
  await require('./telegramBot').start();
})();
