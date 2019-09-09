const { col, fn } = require('sequelize');

const { Category, Item, sequelize } = require('../models');

const getAll = () => {
  const options = {
    // attributes: {
    //   include: [[fn('COUNT', col('items.categoryId')), 'count']],
    // },
    include: {
      model: Item,
      as: 'items',
      // attributes: [],
    },
  };

  return Category.findAll(options);
};

const getById = (id) => {
  const options = {
    include: {
      model: Item,
      as: 'items',
    },
  };

  return Category.findByPk(id, options);
};

const add = async (name) => {
  const transaction = await sequelize.transaction();

  const category = await Category.findOne({ where: { name }, transaction });

  if (category) {
    await transaction.commit();

    return category;
  }

  const result = await Category.create({ name });

  await transaction.commit();

  return result;
};

module.exports = {
  getAll,
  getById,
  add,
};
