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
const onTextHooks = [];
const onVoiceHooks = [];
const onVideoNoteHooks = [];
let bot;

shutdown.onShutdown(async () => await stop());
module.exports = {start, stop, onText, onVoice, onVideoNote, sendDebugText, sendText, sendVoice, replyText, replyVoice};

// functions

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

function onText(fun) {
  onTextHooks.push(fun);
}

function onVoice(fun) {
  onVoiceHooks.push(fun);
}

function onVideoNote(fun) {
  onVideoNoteHooks.push(fun);
}

async function sendDebugText(text) {
  await sendText(env.TELEGRAM_DEBUG_CHAT_ID, text);
}

async function sendText(chatId, text) {
  await bot.telegram.sendMessage(env.TELEGRAM_DEBUG_CHAT_ID, text);
}

async function replyText(ctx, text) {
  await ctx.reply(text, {reply_to_message_id: ctx.message.message_id});
}

async function sendVoice(chatId, voiceBuffer) {
  await bot.telegram.sendVoice(chatId, voiceBuffer);
}

async function replyVoice(ctx, voiceBuffer) {
  await ctx.replyWithVoice({
    source: voiceBuffer,
    filename: 'response.wav'
  }, {reply_to_message_id: ctx.message.message_id});
}

function start() {
  bot = new Telegraf(env.TELEGRAM_BOT_TOKEN, {handlerTimeout: 10_000});

  // echo voice downloaded file
  bot.on(message('voice'), async (ctx) => {
    const {file_id, duration} = ctx.message.voice;
    const {buffer, name} = await downloadByFileId(file_id);
    logger.info(`downloaded voice with name ${name} of size ${human(buffer.length)} and duration ${duration} s`);
    for (let hook of onVoiceHooks)
      hook(ctx, buffer);
  });

  // echo video_note downloaded file
  bot.on(message('video_note'), async (ctx) => {
    const {file_id, duration} = ctx.message.video_note;
    const {buffer, name} = await downloadByFileId(file_id);
    logger.info(`downloaded video_note with name ${name} of size ${human(buffer.length)} and duration ${duration} s`);
    for (let hook of onVideoNoteHooks)
      hook(ctx, buffer);
  });

  bot.command('start', async (ctx) => {
    ctx.reply('commands:\n/start\n/buy');
  });

  bot.command('buy', async (ctx) => {
    await ctx.replyWithInvoice({
      title: 'Echo Support',
      description: 'One shiny Star ✨',
      payload: `stars:${ctx.chat.id}:${Date.now()}`, // will return in successful_payment
      provider_token: '',
      currency: 'XTR',
      prices: [{label: 'Star', amount: 1}],
    });
  });

  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(false, "not implemented"));

  bot.on('successful_payment', (ctx) => {
    const sp = ctx.message.successful_payment;
    logger.info({
      total_stars: sp.total_amount,
      payload: sp.invoice_payload,
      charge_id: sp.telegram_payment_charge_id,
    }, 'payment ok');

    ctx.reply('Thanks for the ⭐️!');
  });

  // echo text
  bot.on(message('text'), async (ctx) => {
    for (let hook of onTextHooks)
      hook(ctx, ctx.message.text);
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
