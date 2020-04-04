const config = require('config');
const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');

const { User } = require('../models');

const options = {
  secretOrKey: config.token.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verifyJwt = async (jwtPayload, next) => {
  try {
    const user = await User.findByPk(jwtPayload.id);

    next(null, user);
  } catch (err) {
    next(err, false);
  }
};

const strategy = new Strategy(options, verifyJwt);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id);

    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

module.exports = strategy;
