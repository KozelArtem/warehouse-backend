const passport = require('passport');

module.exports = {
  needAuth: (req, res, next) => {
    passport.authenticate(
      'jwt',
      {
        session: false,
        failWithError: true,
      },
      (err, user) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          console.log(req.user, user);
          
          return next({
            status: 403,
            message: 'Invalid token',
          });
        }

        return req.logIn(user, (error) => {
          if (error) {
            return next(error);
          }

          return next();
        });
      },
    )(req, res, next);
  },
};
