const { Op } = require('sequelize');

const { Item, Purchase } = require('../models');

const create = async (req, res) => {
  const {
    itemId,
    orderAmount,
    date,
    companyId,
  } = req.body;

  const errors = [];

  if (+itemId < 1) {
    errors.push('itemId');
  }

  if (+orderAmount < 1) {
    errors.push('orderAmount');
  }

  if (!date) {
    errors.push('date');
  }

  try {
    const order = await Purchase.create({ itemId, orderAmount, date, companyId });

    res.send(order || {});
  } catch (err) {
    console.error(err);

    res.send(500).send(err);
  }
};

const update = async (req, res) => {
  const {
    itemId,
    waybillId,
    companyId,
    amount,
    orderAmount,
    price,
    date,
  } = req.body;
  const purchase = req.purchase;

  try {
    const result = await purchase.update({
      itemId,
      waybillId,
      companyId,
      amount,
      amount,
      orderAmount,
      price,
      date,
    });

    res.send(result || {});
  } catch (err) {
    console.error(err);

    res.send(500).send(err);
  }
};

const remove = async (req, res) => {
  const purchase = req.purchase;

  try {
    await purchase.destroy();

    res.send(true);
  } catch (err) {
    console.error(err);

    res.send(500).send(err);
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @todo Use pagination to improve speed X-PAGE-COUNT, query: limit, page, status
 * @todo Add filter by date, need to include limit and page
 * @todo Receive status in query and send filtred array
 */
const getList = async (req, res) => {
  const {
    ids: strIds,
    offset,
    limit,
    active,
    search,
  } = req.query;

  const ids = (strIds || '').split(',').filter(id => id).map(id => +id);
  const query = {
    attributes: ['id', 'amount', 'orderAmount', 'waybillId', 'companyId', 'date'],
    include: [
      {
        model: Item,
        as: 'item',
        attributes: [
          'id',
          'name',
          'amount',
        ],
      },
    ],
    where: {},
    offset: +offset || 0,
    limit: +limit || 10,
  };

  if (ids.length) {
    query.where.id = ids;
  }

  if (search) {
    query.include[0].where = {
      name: {
        [Op.like]: `%${search}%`,
      },
    };
  }

  if (typeof active !== undefined && !search) {
    query.where.amount = (active === 'true') ? { [Op.or]: [0, null] } : { [Op.gte]: 0 };
  }

  try {
    const orders = await Purchase.findAndCountAll(query);

    res.set('X-TOTAL-COUNT', orders.count);
    res.send(orders.rows || []);
  } catch (err) {
    console.error(err);

    res.send(500).send(err);
  }
};

const getActiveList = async (req, res) => {
  const query = {
    attributes: ['id', 'amount', 'orderAmount', 'waybillId', 'companyId', 'date'],
    include: [
      {
        model: Item,
        as: 'item',
        attributes: [
          'id',
          'name',
          'amount',
        ],
      },
    ],
    where: {
      amount: {
        [Op.or]: [0, null],
      }
    },
  };

  try {
    const orders = await Purchase.findAll(query);

    res.send(orders || []);
  } catch (err) {
    console.error(err);

    res.send(500).send(err);
  }
};

module.exports = {
  create,
  update,
  remove,

  getList,
  getActiveList,
};
