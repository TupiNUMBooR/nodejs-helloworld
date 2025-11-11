require('dotenv-flow').config();
const fs = require('fs/promises');
const logger = require('./logger');
require('./metrics').start();
require('./server').start();
require('./telegramBot').start();
require('./openai').ask();
const ffmpeg = require('./ffmpeg');
const tg = require('./telegramBot');
tg.start();
tg.onText((ctx, text) => {
  tg.replyText(ctx, "text received: " + text);
});


(async () => {
  const ogg = await fs.readFile('./test/audio.ogg');
  const wav = await ffmpeg.toWav16kMonoPcm(ogg);
  await fs.writeFile("./test/audio-output.wav", wav);
  logger.info(`Audio output saved as ./test/audio-output.wav`);
})();
