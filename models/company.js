'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'Company',
    {
      name: DataTypes.STRING,
      person: DataTypes.STRING,
      website: DataTypes.STRING,
      email: DataTypes.STRING,
      location: DataTypes.STRING,
      color: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {},
  );
  Company.associate = (models) => {
    Company.hasMany(models.PhoneNumber, {
      foreignKey: 'companyId',
      sourceKey: 'id',
      as: 'phones',
    });

    Company.hasMany(models.Item, {
      foreignKey: 'companyId',
      sourceKey: 'id',
      as: 'items',
    });
  };

  return Company;
};
