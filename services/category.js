const { col, fn } = require('sequelize');

const { Category, Item, sequelize } = require('../models');

const getAll = () => {
  const options = {
    include: {
      model: Item,
      as: 'items',
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

const getByName = (name, opts) => {
  const options = {
    ...opts,
    where: { name },
    include: {
      model: Item,
      as: 'items',
    },
  };

  return Category.findOne(options);
};

const add = async (name) => {
  const transaction = await sequelize.transaction();

  const category = await getByName(name, { transaction })

  if (category) {
    await transaction.commit();

    return category;
  }

  const result = await Category.create({ name });
  
  await transaction.commit();

  return getById(result.id);
};

module.exports = {
  getAll,
  getById,
  add,
};
