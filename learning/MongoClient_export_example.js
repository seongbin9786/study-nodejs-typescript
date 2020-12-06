// MongoClient
const debug = require('debug')('learning:mongoclient');
const { MongoClient } = require('mongodb');

const mongodb = {};

// 비동기 초기화 (... 알아서 잘 되지 않을까?)
// 객체를 미리 만들어 놓고, 초기화 코드만 실행하는 방식 (몽구스처럼) 해야 되는 것 같다.
// mongodb 라이브러리 문서를 좀 봐야 셋업이 될 것 같다... 내일 해야지
(async function () {
  try {
    const client = await MongoClient.connect('mongodb://localhost/');
    mongodb.builder = client.db('studynodets');
  } catch (e) {
    debug(e);
  }
})();

// example use-cases
module.exports = mongodb;
