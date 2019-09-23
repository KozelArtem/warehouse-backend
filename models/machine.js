'use strict';
module.exports = (sequelize, DataTypes) => {
  const Machine = sequelize.define('Machine', {
    name: DataTypes.STRING
  }, {});
  Machine.associate = models => {
    Machine.belongsToMany(models.Item, {
      as: 'items',
      through: {
        model: models.MachineItem,
        unique: false,
      },
      foreignKey: 'machineId',
    });

    // Machine.hasMany(models.Used, {
    //   foreignKey: 'machineId',
    //   sourceKey: 'id',
    //   as: 'uses',
    // });
  };
  return Machine;
};
