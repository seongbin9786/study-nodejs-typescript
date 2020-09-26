const debug = require('debug')('app:auth');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { JwtSecret } = require('./auth/JwtPolicy');
const { ExtractJwtContent } = require('./auth/JwtStructure');

const User = require('./models/User');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JwtSecret,
}, (payload, done) => {
  const { id, role } = ExtractJwtContent(payload);
  debug('Current USER: <id: %o, <role: %o>', id, role);
  // 필요한 경우에 user를 find하는게 맞음.
  return done(null, User({ id, role })); // new User는 안되네. 신기하다
}));
