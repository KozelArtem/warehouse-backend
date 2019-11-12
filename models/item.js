'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    'Item',
    {
      name: DataTypes.STRING,
      imagePath: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      note: DataTypes.STRING,
      companyId: DataTypes.INTEGER,
    },
    {},
  );
  Item.associate = (models) => {
    Item.hasMany(models.Purchase, {
      foreignKey: 'itemId',
      sourceKey: 'id',
      as: 'purchases',
    });

    Item.hasMany(models.ItemDistribution, {
      foreignKey: 'itemId',
      sourceKey: 'id',
      as: 'distributions',
    });

    Item.belongsTo(models.Category, {
      targerKey: 'id',
      foreignKey: 'categoryId',
      as: 'category',
      onDelete: 'CASCADE',
    });

    Item.hasMany(models.Url, {
      foreignKey: 'itemId',
      sourceKey: 'id',
      as: 'urls',
    });

    Item.belongsTo(models.Company, {
      targerKey: 'id',
      foreignKey: 'companyId',
      as: 'company',
      onDelete: 'CASCADE',
    });
  };

  return Item;
};
