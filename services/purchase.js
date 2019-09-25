const Promise = require('bluebird');
const { Op } = require('sequelize');

const { Waybill, Item, Category, Purchase, sequelize } = require('../models');

const purchaseOpts = {
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
};

module.exports = {
  add: async (orders) => {
    const transaction = await sequelize.transaction();
    const savedOrders = [];

    await Promise.each(orders, async (item) => {
      const data = await Purchase.create(item, { transaction });

      savedOrders.push(data.id);
    });

    await transaction.commit();

    const result = await Purchase.findAll({
      where: {
        id: {
          [Op.in]: savedOrders,
        },
      },
      ...purchaseOpts,
    });

    return result;
  },

  addToWaybill: async (waybill, orders) => {
    const transaction = await sequelize.transaction();

    await Promise.each(orders, async (item) => {
      const purchase = await Purchase.findByPk(item.id, { transaction });

      let copy = { ...item };

      copy.date = purchase.date;

      await purchase.update({ ...copy, waybillId: waybill.id });
    });

    await transaction.commit();
  },

  getList: () => Purchase.findAll(purchaseOpts),
};
