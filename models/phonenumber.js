'use strict';
module.exports = (sequelize, DataTypes) => {
  const PhoneNumber = sequelize.define('PhoneNumber', {
    data: DataTypes.STRING,
    companyId: DataTypes.NUMBER
  }, {});
  PhoneNumber.associate = models => {};

  return PhoneNumber;
};
