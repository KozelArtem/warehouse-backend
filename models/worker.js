'use strict';
module.exports = (sequelize, DataTypes) => {
  const Worker = sequelize.define('Worker', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'mechanic',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  Worker.POSITIONS = {
    MECHANIC: 'mechanic',
  }

  return Worker;
};