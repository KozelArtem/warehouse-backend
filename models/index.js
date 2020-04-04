'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('config');

const basename = path.basename(__filename);
const db = {};

const dbConfig = config.database;
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.poolSettings,
    operatorsAliases: false,
    benchmark: dbConfig.benchmark,
  },
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Machine.hasMany(db.MachineService, {
  foreignKey: 'machineId',
  sourceKey: 'id',
  as: 'services',
});

db.Company.hasMany(db.Waybill, {
  foreignKey: 'companyId',
  as: 'waybills',
});

db.User.Roles = {
  ADMIN: 0,
  USER: 1,
};

module.exports = db;
