'use strict';
module.exports = (sequelize, DataTypes) => {
  const Used = sequelize.define('Used', {
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    date: DataTypes.DATE,
  }, {});
  Used.associate =  models => {
    Used.afterCreate(async used => {
      const item = await models.Item.findByPk(used.itemId);
      const amount = +item.amount - (+used.amount);

      await item.update({ amount });
    });

    Used.afterDestroy(async (used) => {
      const item = await models.Item.findByPk(used.itemId);
      const amount = +item.amount + (+used.amount);

      await item.update({ amount });
    });

    // Used.belongsTo(models.Machine, {
    //   targerKey: 'id',
    //   foreignKey: 'categoryId',
    //   as: 'category',
    //   onDelete: 'CASCADE',
    // });
  };
  return Used;
};
