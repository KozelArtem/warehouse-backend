'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Companies', 'description', {
      type: Sequelize.TEXT,
      default: '',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Companies', 'description');
  },
};
