const jwt = require('jsonwebtoken');
const debug = require('debug')('app:auth');

const { JwtSecret, JwtRefreshTimeout, JwtAccessTimeout } = require('./JwtPolicy');

module.exports = (content, isRefresh) => {
  debug('JWT published for: %o, isRefresh: %o', content, isRefresh);
  return jwt.sign(content, JwtSecret, { expiresIn: isRefresh ? JwtRefreshTimeout : JwtAccessTimeout });
};
