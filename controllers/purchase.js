const { Item, Purchase } = require('../models');

const create = async (req, res) => {
  const {
    itemId,
    orderAmount,
    date,
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
    const order = await Purchase.create({ itemId, orderAmount, date });

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
  const strIds = (req.query.ids || '');
  const ids = strIds.split(',').filter(id => id).map(id => +id);
  const query = {
    attributes: ['id', 'amount', 'orderAmount', 'waybillId', 'date'],
    include: [
      {
        model: Item,
        as: 'item',
        attributes: [
          'id',
          'name',
          'amount',
          'companyId',
        ],
      },
    ],
    where: {},
  };

  if (ids.length) {
    query.where.id = ids;
  }

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
};
