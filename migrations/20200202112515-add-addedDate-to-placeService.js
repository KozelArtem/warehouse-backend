'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('PlaceServices', 'addedDate', {
      type: Sequelize.DATE,
      default: Sequelize.fn('NOW') ,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('PlaceServices', 'addedDate');
  },
};
