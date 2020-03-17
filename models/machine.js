'use strict';
module.exports = (sequelize, DataTypes) => {
  const Machine = sequelize.define('Machine', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    lastServiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    nextServiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    paranoid: true,
    timestamps: true,
  });

  return Machine;
};
