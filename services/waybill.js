const { Op } = require('sequelize');

const { Waybill, Item, Purchase, Category, Company, Sequelize } = require('../models');

const waybillOpts = {
  attributes: [
    'id',
    'number',
    'imagePath',
    'date',
  ],
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

  getList: input => {
    const where = {};
    const { itemId } = input;

    if (itemId) {
      where.itemId = itemId;
    }

    const query = {
      attributes: [
        'id',
        'number',
        'imagePath',
        'date',
        [Sequelize.fn('COUNT', Sequelize.col('purchases.id')), 'purchaseCount'],
      ],
      include: {
        model: Purchase,
        as: 'purchases',
        attributes: [],
        where,
      },
      group: ['Waybill.id'],
    };

    return Waybill.findAll(query);
  }, 

  getListByCompanies: async input => {
    let where = {};
    const { dateFrom, dateTo } = input;

    if (dateFrom && dateTo) {
      where.date = {
        [Op.gte]: new Date(dateFrom),
        [Op.lte]: new Date(dateTo),
      };
    }

    const query = {
      attributes: [
        'id',
        'name',
        'color',
      ],
      include: {
        model: Waybill,
        as: 'waybills',
        attributes: [
          'id',
          'number',
          'date',
        ],
        where,
        order: [['date', 'desc']],
      },
    };

    const waybillsByCompanies = await Company.findAll(query);
    const waybillQuery = {
      attributes: [
        'id',
        'number',
        'date',
      ],
      where: {
        ...where,
        companyId: null,
      },
      order: [['date', 'desc']],
    };

    const waybillsWithoutCompany = await Waybill.findAll(waybillQuery);

    return [
      ...waybillsByCompanies,
      {
        id: 0,
        name: '',
        waybills: waybillsWithoutCompany,
      },
    ];
  }, 

  removePurchaseById: async id => {
    const model = await Purchase.findByPk(id);

    await model.destroy();
  },
};
