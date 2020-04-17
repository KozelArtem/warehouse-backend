const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User } = require('../models');

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      next({ status: 401, message: 'login' });

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

    const {
      id,
      username,
      role,
    } = user;
  
    res.send({ token, user: { id, username, role } });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
  }

  res.status(200).send();
};

const getUser = (req, res, next) => {
  const { 
    id,
    username,
    role,
  } = req.user;

  res.send({ id, username, role });
};

module.exports = {
  login,
  logout,
  getUser,
};
