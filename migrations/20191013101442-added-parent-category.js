'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Categories', 'parentId', {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Categories', 'parentId');
  },
};
