'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('ItemDistributions', 'waybillId', {
      type: Sequelize.INTEGER,
      default: null,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('ItemDistributions', 'waybillId');
  },
};
