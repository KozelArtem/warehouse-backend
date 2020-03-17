'use strict';
module.exports = (sequelize, DataTypes) => {
  const MachineService = sequelize.define('MachineService', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    machineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    addedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    isTO: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    paranoid: true,
    timestamps: true,
  });

  return MachineService;
};
