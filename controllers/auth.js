const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User } = require('../models');

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      next({ status: 401 });

      return;
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      next({ status: 401 });

      return;
    }

    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, config.token.secret);

    res.send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
};
