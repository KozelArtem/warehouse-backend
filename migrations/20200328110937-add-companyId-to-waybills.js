'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Waybills', 'companyId', {
      type: Sequelize.INTEGER,
      default: null,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Waybills', 'companyId');
  },
};
