'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Useds', 'placeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaut: 0,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Useds', 'placeId');
  },
};
