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
    logging(s, timing) {
      if (s.indexOf('Exec') === 0) {
        // Extract transaction id, cleanup ugly 'Executing (default): SELECT ...'
        const p0 = s.indexOf('(');
        const p1 = s.indexOf(')');
        const trx = s.substring(p0 + 1, p1);
        const t = s.slice(p1 + 3);
        console.info(t, { timing, trx: trx === 'default' ? '' : trx, });
      } else {
        console.info(s, { timing });
      }
    },
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

db.MachineService.belongsTo(db.Worker, {
  foreignKey: 'doneWorkerId',
  as: 'doneWorker',
});

db.User.Roles = {
  ADMIN: 0,
  USER: 1,
};

module.exports = db;
