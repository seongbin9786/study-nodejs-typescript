const jwt = require('jsonwebtoken');
const debug = require('debug')('app:auth');

const { JwtSecret, JwtRefreshTimeout, JwtAccessTimeout } = require('./JwtPolicy');

module.exports = (content, isRefresh) => {
  debug(`JWT published: ${content}, isRefresh: ${isRefresh}`);
  debug('secret:', JwtSecret);
  return jwt.sign(content, JwtSecret,
    { expiresIn: isRefresh ? JwtRefreshTimeout : JwtAccessTimeout });
};
