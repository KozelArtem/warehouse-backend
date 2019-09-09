const Promise = require('bluebird');
const { col } = require('sequelize');

const {
  Item,
  Purchase,
  Used,
  Category,
  Waybill,
  sequelize,
} = require('../models');

const getInfo = (id) => {
  const options = {
    include: [
      { model: Category, as: 'category' },
      {
        model: Purchase,
        as: 'purchases',
        include: { model: Waybill, as: 'waybill' },
      },
      { model: Used, as: 'uses' },
    ],
  };

  return Item.findByPk(id, options);
};

const getByCategoryId = (categoryId) => {
  const options = {
    include: [{ model: Category, as: 'category' }],
    where: { categoryId },
  };

  return Item.findAll(options);
};

const getAll = () => {
  const options = {
    attributes: {
      include: [[col('category.name'), 'categoryName']],
    },
    include: { model: Category, as: 'category', attributes: [] },
  };

  return Item.findAll(options);
};

const getWaybills = () => {
  const options = {
    include: [
      {
        model: Purchase,
        as: 'purchases',
        include: {
          model: Item,
          as: 'item',
          include: {
            model: Category,
            as: 'category',
          },
        },
      },
    ],
  };

  return Waybill.findAll(options);
};

const getWaybillById = id => {
  const options = {
    include: [
      {
        model: Purchase,
        as: 'purchases',
        include: {
          model: Item,
          as: 'item',
          include: {
            model: Category,
            as: 'category',
          },
        },
      },
    ],
  };

  return Waybill.findByPk(id, options);
};

const add = (data, options) => Item.create(data, options);
const addPurchase = (data, options) => Purchase.create(data, options);
const addUse = (data, options) => Used.create(data, options);

const addWaybill = async (number, date, purchases) => {
  const transaction = await sequelize.transaction();

  const waybill = await Waybill.create(
    { number, date: new Date(date) },
    { transaction },
  );

  await Promise.each(purchases, async (item) => {
    await addPurchase({ ...item, waybillId: waybill.id }, { transaction });
  });

  const options = {
    include: [
      {
        model: Purchase,
        as: 'purchases',
        include: [
          {
            model: Item,
            as: 'item',
            include: {
              model: Category,
              as: 'category',
            },
          },
        ],
      },
    ],
    transaction,
  };

  const result = await Waybill.findByPk(waybill.id, options);

  await transaction.commit();

  return result;
};

module.exports = {
  addWaybill,
  getInfo,
  getAll,
  getWaybills,
  getWaybillById,
  getByCategoryId,
  add,
  addPurchase,
  addUse,
};
