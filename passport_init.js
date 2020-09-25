const debug = require('debug')('app:auth');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('./models/User');
const { JwtSecret } = require('./auth/JwtPolicy');
const { JwtResolveId } = require('./auth/JwtStructure');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JwtSecret,
}, (payload, done) => {
  const id = JwtResolveId(payload);
  debug('Authentication succeded [id:%o]', id);
  User.findById(id, (err, user) => {
    if (user === null) { return done(err, false); }
    if (user) { return done(null, user); }
    return done(null, false);
  });
}));
