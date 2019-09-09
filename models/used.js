'use strict';
module.exports = (sequelize, DataTypes) => {
  const Used = sequelize.define('Used', {
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    date: DataTypes.DATE,
  }, {});
  Used.associate = function(models) {
    Used.afterCreate(async (used) => {
      const item = await models.Item.findByPk(used.itemId);

      const amount = +item.amount - (+used.amount);
      await item.update({ amount });
    });
  };
  return Used;
};
