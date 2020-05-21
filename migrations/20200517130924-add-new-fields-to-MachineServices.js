'use strict';

const { alterTableByColumnsUpDown } = require('../helpers/db');

const tableName = 'MachineServices';

const getColumns = Sequelize => {
  return {
    elimination: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    diagnostic: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    doneWorkerId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  };
};

module.exports = alterTableByColumnsUpDown(tableName, getColumns);

