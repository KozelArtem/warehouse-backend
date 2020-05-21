'use strict';
module.exports = (sequelize, DataTypes) => {
  const RepairItem = sequelize.define('RepairItem', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departureDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    arrivalDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    machineId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    toWarehouse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return RepairItem;
};