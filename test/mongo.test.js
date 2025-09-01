// import test from "node:test";
// import assert from 'node:assert';
// import mongo from '../src/mongo.js';
//
// test('write to mongo', async () => {
//   const doc = [
//     {text: 'test 1', createdAt: new Date(new Date().getTime() - 5000)},
//     {text: 'test 2', createdAt: new Date()}
//   ];
//
//   try {
//     await mongo.connect();
//     let coll = mongo.collection('test-messages');
//
//     coll.drop();
//     assert.equal(await coll.countDocuments(), 0);
//
//     await coll.createIndex({createdAt: -1});
//     await coll.insertMany(doc);
//     const found = await coll.find().toArray();
//
//     assert.equal(found.length, doc.length);
//     for (let i = 0; i < doc.length; i++) {
//       assert.equal(found[i].text, doc[i].text);
//     }
//   } finally {
//     await mongo.close();
//   }
// });
