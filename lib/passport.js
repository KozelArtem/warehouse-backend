const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { User } = require('../models');

const strategy = new JwtStrategy(
  {
    secretOrKey: 'secretKey123',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (jwtPayload, next) => {
    try {
      const user = await User.findByPk(jwtPayload.id);

      next(null, user);
    } catch (err) {
      next(err, false);
    }
  },
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id);

    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

module.exports = strategy;
