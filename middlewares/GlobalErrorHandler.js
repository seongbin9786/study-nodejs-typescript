const debug = require('debug')('app:GlobalErrorHandler');

module.exports = (err, _, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  // TODO: 파일로 출력하기 use winston
  debug('처리하지 못한 오류: %s', err.message);
  res.status(500).send(`서버 오류가 발생했습니다: ${err.message}`);
};
