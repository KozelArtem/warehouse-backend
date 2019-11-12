'use strict';
module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('Url', {
    name: DataTypes.STRING,
    data: DataTypes.STRING,
    itemId: DataTypes.INTEGER
  }, {});
  Url.associate = models => {};

  return Url;
};
