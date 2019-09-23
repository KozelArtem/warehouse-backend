const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const privateUser = {
  id: 1,
  username: '$2b$13$ehdZEYkpRQ6bGakbukI07egpmAlMnjqbQa47VS0GA1WeARavv1tCi',
  password: '$2b$13$eDZ4mODUY/v7968V6HXHAey2fJRW/mAHGmhwhHiHjZrb1JC4GrVey'
};


const strategy = new JwtStrategy(
  {
    secretOrKey: 'secretKey123',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (jwtPayload, next) => {
    try {
      let user = null;
      
      if (jwtPayload.id === privateUser.id) {
        user = privateUser;
      }
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
    let user = null;

    if (id === privateUser.id) {
      user = privateUser;
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

module.exports = strategy;
