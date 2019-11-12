const {
  Item,
  Category,
  ItemDistribution,
  DistributionPlace,
  Purchase,
  Waybill,
  Url,
  Sequelize,
} = require('../models');

const create = async (req, res) => {
  const errors = [];
  const {
    categoryId,
    name,
    amount,
    note,
    imagePath,
    companyId,
    urls,
  } = req.body;
  // TODO Add better validation
  if (!categoryId) {
    errors.push('categoryId');
  }

  if (!name) {
    errors.push('name');
  }

  if (amount < 0) {
    errors.push('amount');
  }

  if (!companyId) {
    errors.push('companyId');
  }

  if (errors.length) {
    res.status(400).send({ message: 'Validation error', fields: errors });

    return;
  }

  try {
    const item = await Item.create({
      categoryId,
      name,
      amount,
      note,
      imagePath,
      companyId,
    });

    if ((urls || []).length) {
      const dbUrls = await Url.bulkCreate(urls);
  
      item.urls = dbUrls;
    }

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  const {
    categoryId,
    name,
    amount,
    note,
    imagePath,
    companyId,
    urls,
  } = req.body;

  try {
    const item = req.item;

    const result = await item.update({
      categoryId,
      name,
      amount,
      note,
      imagePath,
      companyId,
    });

    if ((urls || []).length) {
      const updatedUrls = await Url.bulkUpdate(urls);
      
      result.urls = updatedUrls;
    }

    res.send(result || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  const item = req.item;

  try {
    await item.destroy();

    res.send();
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getById = async (req, res) => {
  const itemId = req.params.itemId;

  const query = {
    attributes: [
      'id',
      'name',
      'amount',
      'note',
      'imagePath',
      'categoryId',
      'companyId',
    ],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
      {
        model: ItemDistribution,
        as: 'distributions',
        attributes: ['id', 'amount', 'date'],
        include: [
          {
            model: DistributionPlace,
            as: 'place',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        model: Purchase,
        as: 'purchases',
        attributes: ['id', 'orderAmount', 'amount', 'date', 'price'],
        include: [
          {
            model: Waybill,
            as: 'waybill',
            attributes: ['id', 'number', 'date'],
          },
        ],
      },
      {
        model: Url,
        as: 'urls',
        attributes: ['id', 'name', 'data'],
      },
    ],
  };

  try {
    const item = await Item.findByPk(itemId, query);

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getList = async (req, res) => {
  const query = {
    attributes: ['id', 'name', [Sequelize.col('category.name'), 'categoryName']],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: [],
      },
    ],
  };

  try {
    const items = await Item.findAll(query);

    res.send(items || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const search = async (req, res) => {
  const search = req.query.search;
  const query = {
    attributes: ['id', 'name', [Sequelize.col('category.name'), 'categoryName']],
    where: {
      name: {
        [Sequelize.Op.substring]: search,
      },
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: [],
      },
    ],
    limit: 20,
  };

  try {
    const items = await Item.findAll(query);

    res.send(items || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const createItemDistribution = async (req, res) => {
  const itemId = req.params.itemId;
  const { placeId, amount, date } = req.body;
  const errors = [];
  // TODO Add better validation
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
    const item = await ItemDistribution.create({ itemId, placeId, amount, date });

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const updateItemDistribution = async (req, res) => {
  const itemDistribution = req.itemDistribution;

  try {
    const item = await itemDistribution.update({ placeId, amount, date });

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const removeItemDistribution = async (req, res) => {
  const itemDistribution = req.itemDistribution;

  try {
    const item = await itemDistribution.destroy();

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getItemDistributionList = async (req, res) => {
  const query = {
    attributes: ['id', 'date', 'amount', 'note'],
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

const getItemDistributionInfo = async (req, res) => {
  const id = req.params.id;
  const query = {
    attributes: ['id', 'date', 'amount', 'note'],
    include: [
      {
        model: DistributionPlace,
        as: 'place',
        attributes: ['id', 'name'],
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

const getDistributionPlaces = async (req, res) => {
  const query = {
    attributes: ['id', 'name'],
  };

  try {
    const distributionPlaces = await DistributionPlace.findAll(query);

    res.send(distributionPlaces || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const createDistributionPlace = async (req, res) => {
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
// getInfoByMachine: async (req, res) => {
//   const { name, start, finish, categoryId } = req.query;

//   const formatedPeriod = [
//     Date.parse(start),
//     Date.parse(finish),
//   ];

//   try {
//     const result = await reportSvc.getInfoByMachine(name, formatedPeriod);

//     res.send(result || []);
//   } catch (err) {
    // console.error(err);
//      
// res.status(500).send(err);
//   }
// },

module.exports = {
  create,
  update,
  remove,
  getById,
  getList,

  search,

  getItemDistributionList,
  getItemDistributionInfo,
  createItemDistribution,
  updateItemDistribution,
  removeItemDistribution,

  getDistributionPlaces,
  createDistributionPlace,
};
