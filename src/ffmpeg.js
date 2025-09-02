const {spawn} = require("child_process");
const {Readable} = require("stream");
const logger = require("./logger");

module.exports = {toWav16kMonoPcm};

/**
 * Converts any supported format into WAV 16kHz mono PCM
 * (suitable for ChatGPT speech APIs).
 * @param {Buffer} inputBuffer - input audio buffer (e.g., voice.ogg)
 * @returns {Promise<Buffer>} - WAV buffer (RIFF/WAVE, pcm_s16le, 16kHz, mono)
 */
function toWav16kMonoPcm(inputBuffer) {
  return new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", [
      "-hide_banner",        // input from stdin
      "-i", "pipe:0",        // input from stdin
      "-vn",                 // ignore any video streams
      "-ar", "16000",        // 16 kHz sample rate
      "-ac", "1",            // mono channel
      "-c:a", "pcm_s16le",   // 16-bit PCM codec
      "-f", "wav",           // WAV container format
      "pipe:1"               // output to stdout
    ], {stdio: ["pipe", "pipe", "pipe"]});
    const outChunks = [];
    let log = "";
    logger.info(`started: ${ff.spawnargs.join(" ")}`);

    ff.stdout.on("data", (c) => outChunks.push(c));
    ff.stderr.on("data", (c) => log += c);
    ff.on("error", reject);
    ff.on("close", (code) => {
      logger.info(`finished: ${ff.spawnargs.join(" ")}`);
      logger.debug(log);
      if (code === 0)
        resolve(Buffer.concat(outChunks));
      else
        reject(new Error(`ffmpeg exited with code ${code}`));
    });

    // Feed the input buffer into ffmpeg's stdin
    Readable.from(inputBuffer).pipe(ff.stdin);
  });
}
