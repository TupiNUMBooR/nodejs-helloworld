const envalid = require('envalid');
const {Telegraf} = require('telegraf');
const {message} = require('telegraf/filters')
const logger = require('./logger');
const shutdown = require('./shutdown');

const env = envalid.cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: envalid.str(),
  TELEGRAM_DEBUG_CHAT_ID: envalid.num()
});
const MAX_DOWNLOAD_BYTES = Number(100 * 1024 * 1024);
let bot;

shutdown.onShutdown(async () => await stop());

function human(bytes) {
  if (bytes < 1024) return bytes + ' B';
  const u = ['KB', 'MB', 'GB', 'TB'];
  let i = -1;
  do {
    bytes /= 1024;
    i++;
  } while (bytes >= 1024 && i < u.length - 1);
  return bytes.toFixed(1) + ' ' + u[i];
}

async function downloadByFileId(fileId) {
  // Ask Telegram API for file path and size
  const info = await bot.telegram.getFile(fileId); // { file_path, file_size, ... }
  const fileSize = Number(info.file_size || 0);

  if (fileSize > MAX_DOWNLOAD_BYTES) {
    throw new Error(`file too big: ${fileSize} > ${MAX_DOWNLOAD_BYTES}`);
  }

  const url = `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${info.file_path}`;
  const name = info.file_path.split('/').pop();

  // Download file into memory
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`download failed: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return {buffer, name};
}

function start() {
  bot = new Telegraf(env.TELEGRAM_BOT_TOKEN, {handlerTimeout: 10_000});

  // echo text
  bot.on(message('text'), async (ctx) => {
    await ctx.reply(ctx.message.text, {reply_to_message_id: ctx.message.message_id});
  });

  // echo voice file_id
  // bot.on(message('voice'), async (ctx) => {
  //   const fileId = ctx.message.voice.file_id;
  //   await ctx.telegram.sendVoice(ctx.chat.id, fileId, {reply_to_message_id: ctx.message.message_id});
  // });

  // echo voice downloaded file
  bot.on(message('voice'), async (ctx) => {
    const {file_id, duration} = ctx.message.voice;
    const {buffer, name} = await downloadByFileId(file_id);
    logger.info(`downloaded voice of size ${human(buffer.length)} and duration ${duration} s`);
    await ctx.replyWithVoice({source: buffer, filename: name}, {reply_to_message_id: ctx.message.message_id});
  });

  // echo video_note file_id
  // bot.on(message('video_note'), async (ctx) => {
  //   const fileId = ctx.message.video_note.file_id;
  //   await ctx.telegram.sendVideoNote(ctx.chat.id, fileId, {reply_to_message_id: ctx.message.message_id});
  // });

  // echo video_note downloaded file
  bot.on(message('video_note'), async (ctx) => {
    const {file_id, duration} = ctx.message.video_note;
    const {buffer, name} = await downloadByFileId(file_id);
    logger.info(`downloaded video_note of size ${human(buffer.length)} and duration ${duration} s`);
    await ctx.replyWithVideoNote({source: buffer, filename: name}, {reply_to_message_id: ctx.message.message_id});
  });

  bot.catch((err) => {
    logger.error(`telegraf error: ${err}`);
  });

  bot.telegram.sendMessage(env.TELEGRAM_DEBUG_CHAT_ID, "helloworld-nodejs bot started")
  bot.launch(); // long polling
  logger.info('Telegram bot started');
}

async function stop() {
  if (bot) {
    await bot.telegram.sendMessage(env.TELEGRAM_DEBUG_CHAT_ID, "helloworld-nodejs bot shutdown")
    await bot.stop();
    logger.info('Telegram bot shutdown');
  }
}

module.exports = {start, stop, bot};
