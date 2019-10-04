const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      next({ status: 401 });

      return;
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (result) {
      const payload = {
        id: user.id,
        role: user.role,
      };

      const token = jwt.sign(payload, 'secretKey123');
      res.send({ token });

      return;
    }

    next({ status: 401 });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signIn,
};
