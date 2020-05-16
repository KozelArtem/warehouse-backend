'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = `
    UPDATE Purchases P
    INNER JOIN Items I ON I.id = P.itemId
    SET P.companyId = I.companyId
    ;`;

    return queryInterface.sequelize.query(query);
  },
};
