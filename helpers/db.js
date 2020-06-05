const addColumns = (queryInterface, Sequelize, tableName, columns) => {
    return Sequelize.Promise.map(Object.keys(columns), column => {
        return queryInterface.addColumn(tableName, column, columns[column])
    });
}

const removeColumns = (queryInterface, Sequelize, tableName, columns) => {
    return Sequelize.Promise.map(Object.keys(columns), column => {
        return queryInterface.removeColumn(tableName, column, column)
    });
}

const alterTableByColumnsUpDown = (tableName, getColumnsFn) => {
    return {
        up: (queryInterface, Sequelize) => {
            return addColumns(queryInterface, Sequelize, tableName, getColumnsFn(Sequelize));
        },

        down: (queryInterface, Sequelize) => {
            return removeColumns(queryInterface, Sequelize, tableName, getColumnsFn(Sequelize));
        },
    };
}

module.exports = {
    addColumns,
    removeColumns,
    alterTableByColumnsUpDown,
};
