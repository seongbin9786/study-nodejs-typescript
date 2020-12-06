const debug = require('debug')('learning:voucher');

const Voucher = require('./Voucher');

// 딱히 오류는 없는 것 같다.
// 그러나 Validation은 되지 않음.
const v1 = new Voucher({
  name: '취미반',
  duration: 30,
  effective_date: new Date(),
  expires_at: new Date(),
});

try {
  debug('v1:', v1);
  Object.keys(v1).forEach(k => debug(k));
  // 기타 이상한 key가 있다.
  debug(v1.toObject());
  debug(v1.toJSON());
  // validate()를 굳이 호출해주면 되긴 하지만...

  (function () {
    try {
      // async 버전의 경우 await을 붙였는데도 잘 안됐음... 뭐지?
      const errors = v1.validateSync();
      debug('errors:', errors);
    } catch (e) {
      debug(e);
    }
  })();
} catch (e) {
  debug(e);
}
