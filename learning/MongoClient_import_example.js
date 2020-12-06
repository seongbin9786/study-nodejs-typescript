const debug = require('debug')('MongoClient');
const mongodb = require('./MongoClient_export_example');

// 현재 Fail
(async function () {
  try {
    debug(mongodb);
    const dbo = mongodb.builder;
    const result = await dbo
      .collection('attendance')
      .find({}, { projection: { _id: 0, user: 0 } })
      .toArray()
      .then(v => v.map(o => o.lesson));

    debug('DB result: ', result);
  } catch (e) {
    debug(e);
  }
})();
