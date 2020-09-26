const debug = require('debug')('app:auth');

const User = require('../models/User');

module.exports = (_, req, __, next) => {
  if (!req.user) { req.user = User({ id: -1, role: '비회원' }); }
  debug('[done] Provided Anonymous User Credential: %o', req.user);
  next();
};
