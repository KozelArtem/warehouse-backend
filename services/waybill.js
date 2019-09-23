const Promise = require('bluebird');

const { Waybill, Item, Purchase, Category, sequelize } = require('../models');

const waybillOpts = {
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

module.exports = {
  add: data => Waybill.create(data),

  getById: id => Waybill.findByPk(id, waybillOpts),

  getList: () => Waybill.findAll(waybillOpts),

  removePurchaseById: async ыid => {
    const model = await Purchase.findByPk(id);

    await model.destroy();
  },
};
