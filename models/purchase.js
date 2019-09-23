'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'Purchase',
    {
      orderAmount: DataTypes.INTEGER,
      date: DataTypes.DATE,
      amount: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      itemId: DataTypes.INTEGER,
      waybillId: DataTypes.INTEGER,
    },
    {},
  );
  Purchase.associate = (models) => {
    Purchase.afterUpdate(async (purchase) => {
      const item = await models.Item.findByPk(purchase.itemId);
      const amount = +item.amount + (+purchase.amount);

      await item.update({ amount });
    });

    Purchase.beforeDestroy(async (purchase) => {
      const item = await models.Item.findByPk(purchase.itemId);
      const amount = +item.amount - (+purchase.amount);

      await item.update({ amount });
    });

    Purchase.hasOne(models.Item, {
      sourceKey: 'itemId',
      foreignKey: 'id',
      as: 'item',
    });

    Purchase.belongsTo(models.Waybill, {
      targerKey: 'id',
      foreignKey: 'waybillId',
      as: 'waybill',
      onDelete: 'CASCADE',
    });
  };
  return Purchase;
};
