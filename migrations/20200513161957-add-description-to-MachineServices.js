'use strict';

const table = 'MachineServices';
const column = 'description';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(table, column, {
      type: Sequelize.TEXT,
      default: null,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(table, column);
  },
};
