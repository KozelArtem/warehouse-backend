'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Companies', 'color', {
      type: Sequelize.STRING,
      default: '#FFF',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Companies', 'color');
  },
};
