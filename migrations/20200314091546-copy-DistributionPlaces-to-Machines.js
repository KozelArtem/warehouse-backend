'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = `
    insert into Machines (
      name,
      createdAt,
      updatedAt
    ) (
      select
        P.name as name,
        P.createdAt as createdAt,
        P.updatedAt as updatedAt
      from
        DistributionPlaces as P
    );`;

    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {},
};
