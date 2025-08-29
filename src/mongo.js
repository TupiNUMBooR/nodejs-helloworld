const {MongoClient} = require('mongodb');
const envalid = require('envalid');
const shutdown = require('./shutdown');

const env = envalid.cleanEnv(process.env, {
  MONGO_URI: envalid.str()
});
let client;
let db;

shutdown.onShutdown(() => close());

async function connect() {
  if (db) return db;
  client = new MongoClient(env.MONGO_URI, {maxPoolSize: 10});
  await client.connect();
  db = client.db('nodejs-helloworld');
  return db;
}

function collection(name) {
  if (!db) throw new Error('DB not connected. Call connect() first.');
  return db.collection(name);
}

async function close() {
  if (client) await client.close();
  client = undefined;
  db = undefined;
}

module.exports = {connect, close, collection};
