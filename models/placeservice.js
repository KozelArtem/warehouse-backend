'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlaceService = sequelize.define(
    'PlaceService',
    {
      placeId: DataTypes.INTEGER,
      name: DataTypes.TEXT,
      completed: DataTypes.BOOLEAN,
      completedDate: DataTypes.DATE,
    },
    {},
  );

  PlaceService.associate = (models) => {};

  return PlaceService;
};
