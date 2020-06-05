const { Op } = require('sequelize');

const { Worker } = require('../models');

const getWorkersByInput = input => {
  const {
    position,
  } = input;

  const query = {
    attributes: ['id', 'name', 'surname', 'position'],
    where: {},
  };

  if (position) {
    query.where.position = {
      [Op.like]: position,
    };
  }

  return Worker.findAll(query);
};

module.exports = {
  getWorkersByInput,
};
