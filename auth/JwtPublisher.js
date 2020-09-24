const jwt = require('jsonwebtoken');
const debug = require('debug')('app:auth');

module.exports = function (email) {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    subject: email,
  }, process.env.JWT_SECRET);
};
