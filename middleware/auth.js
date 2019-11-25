const passport = require('passport');

const { User } = require('../models');

module.exports = {
  requireAuth: (req, res, next) => {
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

  requireAdmin: (req, res, next) => {
    if (req.user.role !== User.Roles.ADMIN) {
      res.status(403).send({ message: 'You don\'t have permission'});
      
      return;
    }

    next();
  },
};
