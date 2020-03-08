'use strict';
module.exports = (sequelize, DataTypes) => {
  const ItemDistribution = sequelize.define('ItemDistribution', {
    placeId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    amount: DataTypes.INTEGER,
    note: DataTypes.STRING,
    waybillId: DataTypes.INTEGER,
  }, {});

  ItemDistribution.associate = models => {
    ItemDistribution.afterCreate(async itemDistribution => {
      const item = await models.Item.findByPk(itemDistribution.itemId);
      const amount = +item.amount - (+itemDistribution.amount);

      await item.update({ amount });
    });

    ItemDistribution.afterDestroy(async itemDistribution => {
      const item = await models.Item.findByPk(itemDistribution.itemId);
      const amount = +item.amount + (+used.amount);

      await item.update({ amount });
    });

    ItemDistribution.belongsTo(models.Item, {
      targerKey: 'id',
      foreignKey: 'itemId',
      onDelete: 'CASCADE',
    });

    ItemDistribution.belongsTo(models.DistributionPlace, {
      targerKey: 'id',
      foreignKey: 'placeId',
      as: 'place',
      onDelete: 'CASCADE',
    });

    ItemDistribution.hasOne(models.Item, {
      sourceKey: 'itemId',
      foreignKey: 'id',
      as: 'item',
    });

    ItemDistribution.hasOne(models.Waybill, {
      sourceKey: 'waybillId',
      foreignKey: 'id',
      as: 'waybill',
    });
  };

  return ItemDistribution;
};
