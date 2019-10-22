'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Items', 'note', Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Items', 'note');
  },
};
