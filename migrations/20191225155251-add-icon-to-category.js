'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Categories', 'icon', {
      type: Sequelize.STRING,
      default: 'mdi-folder',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Categories', 'icon');
  },
};
