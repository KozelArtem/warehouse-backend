'use strict';
module.exports = (sequelize, DataTypes) => {
  const DictionaryToUses = sequelize.define('DictionaryToUses', {
    name: DataTypes.STRING,
  }, {});
  DictionaryToUses.associate = models => {
    DictionaryToUses.hasMany(models.Used, {
      foreignKey: 'placeId',
      sourceKey: 'id',
      as: 'uses',
    });

  };
  return DictionaryToUses;
};
