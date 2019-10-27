'use strict';
module.exports = (sequelize, DataTypes) => {
  const DistributionPlace = sequelize.define(
    'DistributionPlace',
    {
      name: DataTypes.STRING,
    },
    {},
  );

  DistributionPlace.associate = (models) => {
    DistributionPlace.hasMany(models.ItemDistribution, {
      foreignKey: 'placeId',
      as: 'distributions',
    });
  };

  return DistributionPlace;
};
