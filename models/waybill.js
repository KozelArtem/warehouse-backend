'use strict';
module.exports = (sequelize, DataTypes) => {
  const Waybill = sequelize.define('Waybill', {
    number: DataTypes.INTEGER,
    date: DataTypes.DATE,
    imagePath: DataTypes.STRING
  }, {});
  Waybill.associate = models => {
    Waybill.hasMany(models.Purchase, {
      foreignKey: 'waybillId',
      sourceKey: 'id',
      as: 'purchases',
    })
  };
  return Waybill;
};
