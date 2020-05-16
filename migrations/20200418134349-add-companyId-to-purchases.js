'use strict';

const table = 'Purchases';
const column = 'companyId';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(table, column, {
      type: Sequelize.INTEGER,
      default: null,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(table, column);
  },
};
