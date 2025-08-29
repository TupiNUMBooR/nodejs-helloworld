const envalid = require('envalid');
const OpenAI = require('openai');
const logger = require('./logger');

const env = envalid.cleanEnv(process.env, {
  OPENAI_API_KEY: envalid.str()
});
const client = new OpenAI({apiKey: env.OPENAI_API_KEY});

function randomLetter() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

async function ask() {
  const letter = randomLetter().toUpperCase();
  logger.info(`Asking for joke from OpenAI with letter '${letter}'`);
  const res = await client.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      {role: 'system', content: 'Tell a random joke where most words start with letter from user message'},
      {role: 'user', content: letter},
    ]
  });

  const response = res.choices?.[0]?.message?.content;
  logger.info(`Response from OpenAI: "${response}"`);
}

module.exports = {ask};
