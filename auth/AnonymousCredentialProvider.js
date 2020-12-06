const debug = require('debug')('app:auth');

const User = require('../models/User');

module.exports = (_, req, __, next) => {
  if (!req.user) {
    // TODO: _id가 인식이 안 돼서 ObjectId가 계속 낭비되고 있다. 어떻게 해야 하지?
    // 흠.. _id 인데도 저러는건 문제가 있음. 뭐지..?
    req.user = new User({ role: '비회원', voucher: null });
  }
  debug('[done] Provided Anonymous User Credential: %o', req.user);
  next();
};
