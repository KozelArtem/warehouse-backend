const { Waybill, Item, Purchase, Category, Company, Sequelize } = require('../models');

const waybillOpts = {
  include: [
    {
      model: Purchase,
      as: 'purchases',
      attributes: ['id', 'orderAmount', 'amount', 'date'],
      include: {
        model: Item,
        as: 'item',
        attributes: ['id', 'name'],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name'],
          },
        ],
      },
    },
  ],
};

module.exports = {
  add: data => Waybill.create(data),

  getById: id => Waybill.findByPk(id, waybillOpts),

  getList: () => Waybill.findAll({
    attributes: {
      include: [[Sequelize.fn('COUNT', Sequelize.col('purchases.id')), 'purchaseCount']],
    },
    include: {
      model: Purchase,
      as: 'purchases',
      attributes: [],
    },
    group: ['Waybill.id'],
  }),

  removePurchaseById: async ыid => {
    const model = await Purchase.findByPk(id);

    await model.destroy();
  },
};
