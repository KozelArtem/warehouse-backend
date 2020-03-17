'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = `
    insert into "MachineServices" (
      "name",
      "completed",
      "addedAt",
      "completedAt",
      "createdAt",
      "updatedAt",
      "machineId"
    ) (
      select
        PS."name" as name,
        PS."completed" as completed,
        PS."addedDate" as addedAt,
        PS."completedDate" as completedAt,
        PS."createdAt" as createdAt,
        PS."updatedAt" as updatedAt,
        M."id" as machineId
      from
        "PlaceServices" as PS
      inner join
        "DistributionPlaces" as P on PS."placeId" = P.id
      left join "Machines" as M on M.name = P.name
    );`;

    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {},
};
