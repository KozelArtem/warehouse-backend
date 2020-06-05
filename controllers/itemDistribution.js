const { Op, fn, col } = require('sequelize');

const {
  ItemDistribution,
  DistributionPlace,
  Waybill,
} = require('../models');

const create = async (req, res) => {
  const { 
    itemId,
    placeId,
    amount,
    date,
    waybillId,
  } = req.body;

  const errors = [];
  // TODO Add better validation
  if (!itemId) {
    errors.push('itemId');
  }

  if (!placeId) {
    errors.push('placeId');
  }

  if (amount < 0) {
    errors.push('amount');
  }

  if (!date) {
    errors.push('date');
  }

  if (errors.length) {
    res.status(400).send({ message: 'Validation error', fields: errors });

    return;
  }
  try {
    const item = await ItemDistribution.create({ itemId, placeId, amount, date, waybillId });

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  const itemDistribution = req.itemDistribution;
  const input = req.body;

  const fields = Object.keys(input)
    .filter(key => !!input[key])
    .reduce((acc, key) => ({ ...acc, [key]: input[key] }));

  try {
    const item = await itemDistribution.update(fields);

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  const itemDistribution = req.itemDistribution;

  try {
    const item = await itemDistribution.destroy();

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getList = async (req, res) => {
  const query = {
    attributes: ['id', 'date', 'amount', 'note', 'waybillId'],
    include: [
      {
        model: DistributionPlace,
        as: 'place',
        attributes: ['id', 'name'],
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'name'],
      },
      {
        model: Waybill,
        as: 'waybill',
        attributes: ['id', 'number'],
      },
    ],
  };

  try {
    const itemDistributions = await ItemDistribution.findAll(query);

    res.send(itemDistributions || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getInfo = async (req, res) => {
  const id = req.params.id;
  const query = {
    attributes: ['id', 'date', 'amount', 'note', 'placeId', 'waybillId'],
    include: [
      {
        model: DistributionPlace,
        as: 'place',
        attributes: ['id', 'name'],
      },
      {
        model: Waybill,
        as: 'waybill',
        attributes: ['id', 'number', 'date'],
      },
    ],
  };

  try {
    const itemDistribution = await ItemDistribution.findByPk(id, query);

    res.send(itemDistribution || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getPlaces = async (req, res) => {
  const {
    search,
    extended,
  } = req.query;

  const query = {
    attributes: ['id', 'name'],
    where: {},
    include: [],
  };

  if (search) {
    query.where.name = {
      [Op.like]: `%${search}%`,
    };
  }

  if (extended) {
    query.attributes.push(
      'createdAt',
      [fn('COUNT', col('distributions.id')), 'usedAmount']
      );
    query.group = ['id'];
    query.order = [[col('usedAmount'), 'desc']];
    query.include.push({
      model: ItemDistribution,
      as: 'distributions',
      attributes: [],
    })
  }


  try {
    const result = await DistributionPlace.findAndCountAll(query);

    res.set('X-TOTAL-COUNT', result.count);
    res.send(result.rows || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const createPlace = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send({ message: 'Validation error', fields: ['name'] });

    return;
  }

  try {
    const distributionPlace = await DistributionPlace.create({ name });

    res.send(distributionPlace || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const updatePlace = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send({ message: 'Validation error', fields: ['name'] });

    return;
  }

  try {
    req.place.name = name;
    const result = await req.place.save();

    res.send(result || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const removePlace = async (req, res) => {
  try {
    const result = await req.place.destroy();

    res.send(result || false);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

module.exports = {
  create,
  update,
  remove,
  getList,
  getInfo,

  createPlace,
  updatePlace,
  removePlace,
  getPlaces,
};
