const debug = require('debug')('app:auth');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('./models/User');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  // TODO: issuer, audience 추가하면 작동하지 않는다.
}, ({ subject }, done) => {
  debug('Authentication succeded [id:%o]', subject);
  User.findById(subject, (err, user) => {
    if (user === null) { return done(err, false); }
    if (user) { return done(null, user); }
    return done(null, false);
  });
}));
