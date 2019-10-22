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
    },
    {},
  );
  Item.associate = (models) => {
    Item.hasMany(models.Purchase, {
      foreignKey: 'itemId',
      sourceKey: 'id',
      as: 'purchases',
    });

    Item.hasMany(models.Used, {
      foreignKey: 'itemId',
      sourceKey: 'id',
      as: 'uses',
    });

    Item.belongsTo(models.Category, {
      targerKey: 'id',
      foreignKey: 'categoryId',
      as: 'category',
      onDelete: 'CASCADE',
    });

    Item.belongsToMany(models.Machine, {
      through: {
        model: models.MachineItem,
        unique: false,
      },
      foreignKey: 'itemId',
    });
  };
  return Item;
};
