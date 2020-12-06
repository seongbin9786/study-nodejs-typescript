const debug = require('debug')('app:auth');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { JwtSecret } = require('./auth/JwtPolicy');
const { ExtractJwtContent } = require('./auth/JwtStructure');

const User = require('./models/User');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtSecret,
    },
    (payload, done) => {
      const { id, role, voucher } = ExtractJwtContent(payload);
      debug('Current USER: <id: %o, <role: %o>, <voucher: %o>', id, role, voucher);
      // 필요한 경우에 user를 find하는게 맞음.
      // id로 주면 인식하지 못한다.
      return done(null, new User({ _id: id, role, voucher }));
    },
  ),
);
