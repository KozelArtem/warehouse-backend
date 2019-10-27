'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.INTEGER,
    },
    {},
  );

  User.associate = (models) => {
    User.beforeCreate(async (user) =>
      Object.assign(user, { password: await bcrypt.hash(user.password, 12) }),
    );
  };

  return User;
};
