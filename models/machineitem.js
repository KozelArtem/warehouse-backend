'use strict';
module.exports = (sequelize, DataTypes) => {
  const MachineItem = sequelize.define('MachineItem', {
    itemId: DataTypes.INTEGER,
    machineId: DataTypes.INTEGER
  }, {});
  MachineItem.associate = models => {
    MachineItem.belongsTo(models.Item, {
      foreignKey: 'itemId',
      targetId: 'id',
      onDelete: 'CASCADE',
    });

    MachineItem.belongsTo(models.Machine, {
      foreignKey: 'machineId',
      targetId: 'id',
      onDelete: 'CASCADE',
    });
    // associations can be defined here
  };
  return MachineItem;
};
